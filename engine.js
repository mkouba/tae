function runGame(initState, headless) {
    const engine = createEngine(headless);
    engine.initState = initState;
    engine.run();
    return engine;
}

function createEngine(headless) {

    const engine = {};

    engine.run = function (skipIntro = false) {
        if (headless) {
            engine.initGame();
            engine.start();
        } else {
            // First reset UI controls
            const gameContainerDiv = document.querySelector("#game-container");
            while (gameContainerDiv.firstChild) {
                gameContainerDiv.removeChild(gameContainerDiv.firstChild);
            }
            if (engine.initState.intro && !skipIntro) {
                intro(0, engine.initState.intro, function () {
                    engine.initGame();
                    engine.start();
                });
            } else {
                engine.initGame();
                engine.start();
            }

            initOutputQueue();
        }
    }

    const printPositions = function (game, params) {
        const limit = 20;
        let positions = engine.getPositions(game);
        let shortened = false;
        if (positions.length > limit) {
            shortened = true;
            positions = positions.slice(0, limit);
        }
        if (positions.length === 0) {
            if (game.messages.gamePositionsEmpty) {
                game.print(game.messages.gamePositionsEmpty, "hint");
            }
        } else if (game.messages.gamePositions) {
            let msg = game.messages.gamePositions + positions.map(p => p[0]).join(", ");
            if (shortened) {
                msg += ", ...";
            }
            game.print(msg, "hint");
        }
    };

    // TODO localized messages?
    engine.actions = [{
        name: "restart",
        builtin: true,
        perform: function () {
            engine.run(false);
        }
    }, {
        name: "save",
        aliases: ["uloz", "ulož"],
        builtin: true,
        perform: function (game, params) {
            const positionName = engine.save(params);
            if (game.messages.gameSaved) {
                game.print(game.messages.gameSaved + " [" + positionName + "]", "hint");
            }
            if (game.onSave) {
                game.onSave(game);
            }
        }
    }, {
        name: "games",
        aliases: ["pozice"],
        builtin: true,
        perform: printPositions
    }, {
        name: "load",
        aliases: ["nahrat", "nahraj"],
        builtin: true,
        perform: function (game, params) {
            // If no param and save does not exist - print positions
            const positionName = engine.load(params);
            if (!positionName && params.length === 0) {
                printPositions(game, params);
                return;
            }
            if (positionName) {
                // NOTE: we cannot use the "game" param because a new game was
                // loaded already
                if (engine.game.messages.gameLoaded) {
                    engine.game.print(engine.game.messages.gameLoaded + " [" + positionName +
                        "]", "hint");
                }
            } else {
                // Game position does not exist
                if (engine.game.messages) {
                    if (engine.game.messages.gamePositionDoesNotExist) {
                        engine.game.print(engine.game.messages.gamePositionDoesNotExist + params.join(" "), "hint");
                    } else if (engine.game.messages.unknownCommand) {
                        engine.game.print(engine.game.messages.unknownCommand);
                    }
                }
            }
        },
        autocomplete: function (game, str) {
            const limit = 10;
            let positions = engine.getPositions(game);
            if (positions.length === 0) {
                return positions;
            }
            let shortened = false;
            if (positions.length > limit) {
                shortened = true;
                positions = positions.slice(0, limit);
            }
            if (!str || str.length === 0) {
                return positions.map(function (p) {
                    const ret = {};
                    ret.name = p[0];
                    return ret;
                });
            } else {
                return positions.filter(p => p[0].startsWith(str)).map(function (p) {
                    const ret = {};
                    ret.name = p[0];
                    return ret;
                })
            }
        }
    }];

    engine.initGame = function (position) {
        engine.game = createGame(this.initState, position, headless);
        // A game should be able to load the last position
        engine.game.loadLastPosition = function () {
            return engine.loadLastPosition();
        };
        engine.game.load = function (params) {
            return engine.load(params);
        };
        engine.game.save = function (params) {
            return engine.save(params);
        };
        engine.game.getPositions = function () {
            return engine.getPositions(engine.game);
        }
        engine.game.clearAll();
        console.log("Game initialized");
    }

    // For debug only
    engine.processCommands = function (commands) {
        commands.forEach(cmd => {
            engine.processCommand(cmd);
        });
    }

    engine.processCommand = function (command) {
        if (!command || command.length === 0) {
            // Empty command - do nothing
            return;
        }

        const game = engine.game;
        if (game.endState) {
            console.log("Game is over!");
            return;
        }
        if (headless) {
            console.log(">> " + command);
        }
        command = command.trim();
        if (game.adaptCommand) {
            command = game.adaptCommand(game, command);
        }

        const parts = command.split(/\s+/);
        if (parts.length === 0) {
            return;
        }

        // The action if only one matches the command
        let action = null;
        // "use" -> 1
        // "look at" -> 2
        let actionPartsLength = 1;

        // Find all matching actions
        const actions = game.getActions().filter(function (action) {
            const matching = game.getMatchingNameOrAlias(action, parts);
            if (matching) {
                actionPartsLength = matching.split(/\s+/).length;
                return true;
            }
            return false;
        });
        // Add built-in actions
        // Multi-word built-in actions are not supported!
        engine.actions.filter(action => engine.game.aliasObjectMatchesName(action, parts[0])).forEach(action => actions.push(action));

        if (actions.length === 0) {
            // Uknown command
            const unknownCommandAction = game.getAction("unknownCommand", true);
            if (unknownCommandAction) {
                action = unknownCommandAction;
            } else if (game.onUknownCommand) {
                game.onUknownCommand(game, parts[0]);
            } else if (game.messages && game.messages.unknownCommand) {
                game.print(game.messages.unknownCommand);
            }
        } else if (actions.length === 1) {
            if (game.printCommand) {
                game.print("$ " + inputValue, "command");
            }
            action = actions[0];
        } else {
            if (game.messages && game.messages.multipleActionsMatch) {
                game.print(game.messages.multipleActionsMatch + " " + actions.map(action => action.name).join(", "));
            }
        }

        game.clearInputHelp();
        if (game.messages && game.messages.inputHelpTip) {
            game.printInputHelp(game.messages.inputHelpTip);
        }

        if (action) {
            const params = [];
            if (parts.length > 1) {
                parts.slice(actionPartsLength).forEach(part => {
                    if (part) {
                        const param = part.trim();
                        if (param.length > 0) {
                            if (!game.parameterFilter || game.parameterFilter(part)) {
                                params.push(param);
                            }
                        }
                    }
                });
            }

            // First invoke location callback
            let skipAction = false;
            if (game.location.beforeAction) {
                skipAction = game.location.beforeAction(game, action, params);
            }
            if (!skipAction) {
                action.perform(game, params);
                // Location callback
                if (game.location.afterAction) {
                    game.location.afterAction(game, action, params);
                }
                // Global callback
                if (game.afterAction) {
                    game.afterAction(game, action, params);
                }
                return action;
            }
        }
    }

    engine.start = function () {
        const game = engine.game;

        let inputBox, historyLimit, lineLimit, inputs;

        if (game.onStart) {
            game.onStart(game);
        }
        if (!game.time) {
            game.time = 0;
        }

        if (!headless && !game.skipInputBox) {
            this.inputs = [];
            this.historyPos = 0;

            inputBox = document.querySelector("#game-input");
            inputBox.focus();
            historyLimit = 20;
            lineLimit = 20;
            inputs = this.inputs;

            inputBox.onkeydown = (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    const action = processInput();
                    if (action && action.name === "restart") {
                        // Stop propagation for restart command
                        e.stopPropagation();
                    }
                } else if (e.key === "ArrowUp") {
                    historyPrev();
                } else if (e.key === "ArrowDown") {
                    historyNext();
                } else if (e.key === "Tab") {
                    e.preventDefault();
                    autocomplete();
                }
            };
        }

        function processInput() {
            if (game.endState) {
                return;
            }
            const inputValue = inputBox.value;

            if (inputs.length > historyLimit) {
                inputs.shift();
            }
            if (inputs.length > 0) {
                if (inputs[inputs.length - 1] !== inputValue) {
                    inputs.push(inputValue);
                }
            } else {
                inputs.push(inputValue);
            }
            inputBox.value = "";
            this.historyPos = inputs.length;

            // return the action performed
            return engine.processCommand(inputValue);
        }

        function historyPrev() {
            if (inputs.length > 0) {
                this.historyPos--;
                if (this.historyPos < 0) {
                    this.historyPos = 0;
                }
                inputBox.value = inputs[this.historyPos];
            }
        }

        function historyNext() {
            if (inputs.length > 0) {
                this.historyPos++;
                if (this.historyPos >= inputs.length) {
                    this.historyPos = inputs.length - 1;
                }
                inputBox.value = inputs[this.historyPos];
            }
        }

        function autocomplete() {
            const inputValue = inputBox.value.trim();
            if (inputValue.length === 0) {
                // No input - list all actions
                const actions = engine.game.getActions();
                engine.actions.forEach(action => actions.push(action));
                engine.game.clearInputHelp();
                const prefix = engine.game.messages.inputHelpPrefix ? engine.game.messages.inputHelpPrefix : "";
                engine.game.printInputHelp(prefix + actions.map(action => action.name).join(", "));
                return;
            }

            // Find matching actions:
            // (a) Single action found - try to autocomplete parameters
            // (b) Multiple actions found - list actions
            // (c) No action found - do nothing
            const inputParts = inputValue.split(/\s+/);
            let actionMatch;

            const actions = game.getActions().filter(function (action) {
                const match = game.getMatchingNameOrAlias(action, inputParts);
                if (match) {
                    actionMatch = match;
                    return true;
                }
                return false;
            });
            // Add built-in actions
            // Multi-word built-in actions are not supported!
            engine.actions.filter(action => engine.game.aliasObjectMatchesName(action, inputParts[0])).forEach(action => actions.push(action));

            if (actions.length === 0) {
                // No action found
                engine.game.clearInputHelp();
                engine.game.printInputHelp("\xa0");
            } else if (actions.length === 1) {
                // One action matches -> complete the action name/alias or call action.autocomplete()
                const action = actions[0];
                if (!actionMatch) {
                    actionMatch = action.name;
                }
                inputBox.value = actionMatch + " ";
                const actionMatchLength = actionMatch.split(/\s+/).length;
                if (((inputParts.length - actionMatchLength) <= 1) && action.autocomplete) {
                    const actionParamStr = inputParts[actionMatchLength];
                    const results = action.autocomplete(engine.game, actionParamStr);
                    if (results) {
                        if (results.length === 1) {
                            inputBox.value = inputBox.value + results[0].name + " ";
                        } else if (results.length > 1) {
                            if (actionParamStr) {
                                inputBox.value = inputBox.value + actionParamStr;
                            }
                            engine.game.clearInputHelp();
                            const prefix = engine.game.messages.inputHelpPrefix ? engine.game.messages.inputHelpPrefix : "";
                            engine.game.printInputHelp(prefix + results.map(r => r.name).join(", "));
                        }
                    }
                }
            } else {
                // Miltiple actions match - list the actions
                engine.game.clearInputHelp();
                const prefix = engine.game.messages.inputHelpPrefix ? engine.game.messages.inputHelpPrefix : "";
                engine.game.printInputHelp(prefix + actions.map(action => {
                    let val = action.name;
                    if (!val.startsWith(inputValue)) {
                        val = action.aliases.find(alias => alias.startsWith(inputValue));
                    }
                    return val;
                }).join(", "));
            }
        }

        // Start the game
        this.game.enterLocation(this.game.getLocation(this.game.startLocation));
    }

    engine.save = function (params) {
        const position = {};
        position.locations = this.game.locations;
        position.items = this.game.items;
        position.time = this.game.time;
        position.location = this.game.location.id;
        position.inventory = this.game.inventory;
        position.timestamp = Date.now();
        const positionName = getPositionName(params);
        localStorage.setItem(positionName, JSON.stringify(position));
        console.log("Game saved: " + positionName);
        return params && params.length > 0 ? params[0] : "save";
    }

    engine.load = function (params) {
        const positionName = getPositionName(params);
        const position = localStorage.getItem(positionName);
        if (position) {
            this.initGame(JSON.parse(position));
            this.start();
            console.log("Game loaded: " + positionName);
            if (engine.game.onLoad) {
                engine.game.onLoad(engine.game, positionName.substring(buildPositionPrefix(engine.game).length, positionName.length));
            }
            return params && params.length > 0 ? params[0] : "save";
        } else {
            console.log("Game position does not exist: " + positionName);
            return undefined;
        }
    }

    // Returns positions - [name, data, timestamp] - sorted by timestamp (lifo)
    engine.getPositions = function (game, sortFun) {
        const prefix = buildPositionPrefix(game);
        const positions = [];
        for (var i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key.startsWith(prefix)) {
                continue;
            }
            const pos = [];
            pos.push(key.substring(prefix.length, key.length));
            pos.push(JSON.parse(localStorage.getItem(key)));
            pos.push(pos[1].timestamp);
            positions.push(pos);
        }
        if (positions.length != 0) {
            if (!sortFun) {
                sortFun = function (a, b) {
                    const ts1 = a[2];
                    const ts2 = b[2];
                    if (ts1 && ts2) {
                        return ts2 - ts1;
                    } else if (ts1) {
                        return -1;
                    } else if (ts2) {
                        return 1;
                    }
                    return 0;
                };
            }
            positions.sort(sortFun);
        }
        return positions;
    }

    engine.loadLastPosition = function () {
        const positions = engine.getPositions(engine.game);
        if (positions.length === 0) {
            return false;
        }
        this.initGame(positions[0][1]);
        this.start();
        if (engine.game.messages.gameLoaded) {
            engine.game.print(engine.game.messages.gameLoaded + " [" + positions[0][0] +
                "]", "hint");
        }
        console.log("Game loaded: " + positions[0][0]);
        return true;
    }

    function getPositionName(params) {
        return buildPositionPrefix(engine.game) + (params.length === 0 ? "save" : params[0]);
    }

    return engine;
}

function buildPositionPrefix(game) {
    const prefix = game.savedPositionPrefix;
    if (!prefix) {
        console.log("Game does not specify a 'saved position prefix' - SAVE/LOAD may not work correctly");
    }
    return (prefix ? prefix : "unknown") + "_";
}

function createGame(initialState, savedPosition, headless) {

    let gameContainerDiv;
    if (!headless) {
        gameContainerDiv = document.querySelector("#game-container");
        while (gameContainerDiv.firstChild) {
            gameContainerDiv.removeChild(gameContainerDiv.firstChild);
        }
    }

    let inputBox, title, outputContainerDiv, locationDiv, outputDiv, inputHelpDiv, inputContainerDiv, inputTip;

    const game = JSON.parse(JSON.stringify(initialState));
    game.endState = undefined;
    game.actions = initialState.actions;
    game.onStart = initialState.onStart;
    game.onEnd = initialState.onEnd;
    game.onLocationInfo = initialState.onLocationInfo;
    game.onShiftTime = initialState.onShiftTime;
    game.onUknownCommand = initialState.onUknownCommand;
    game.afterAction = initialState.afterAction;
    game.buildLocationMessage = initialState.buildLocationMessage;
    game.onLocationItemAdded = initialState.onLocationItemAdded;
    game.adaptCommand = initialState.adaptCommand;
    game.parameterFilter = initialState.parameterFilter;
    game.onEnterLocation = initialState.onEnterLocation;
    game.onLoad = initialState.onLoad;
    game.headless = headless;

    if (savedPosition) {
        game.locations = savedPosition.locations;
        game.items = savedPosition.items;
        game.time = savedPosition.time;
        game.startLocation = savedPosition.location;
        game.inventory = savedPosition.inventory;
    } else {
        game.inventory = [];
        if (initialState.inventory) {
            initialState.inventory.forEach(item => game.inventory.push(item));
        }
    }

    if (headless) {
        console.log("Creating headless game...");
    } else {
        // Init UI controls
        // game-title
        if (initialState.title) {
            title = document.createElement("h1");
            title.id = "game-title";
            title.textContent = initialState.title;
            gameContainerDiv.insertBefore(title, null);
        }
        // game-output-container
        outputContainerDiv = document.createElement("div");
        outputContainerDiv.id = "game-output-container";
        gameContainerDiv.appendChild(outputContainerDiv);
        // game-location
        locationDiv = document.createElement("div");
        locationDiv.id = "game-location";
        outputContainerDiv.appendChild(locationDiv);
        // game-output
        outputDiv = document.createElement("div");
        outputDiv.id = "game-output";
        outputContainerDiv.appendChild(outputDiv);
        if (!game.skipInputBox) {
            // game-input-container
            inputContainerDiv = document.createElement("div");
            inputContainerDiv.id = "game-input-container";
            gameContainerDiv.appendChild(inputContainerDiv);
            // game-input-help
            inputHelpDiv = document.createElement("div");
            inputHelpDiv.id = "game-input-help";
            inputContainerDiv.appendChild(inputHelpDiv);
            // game-input
            inputBox = document.createElement("input");
            inputBox.id = "game-input";
            inputContainerDiv.appendChild(inputBox);
            // game-input-tip
            inputTip = document.createElement("div");
            inputTip.id = "game-input-tip";
            inputContainerDiv.appendChild(inputTip);
        }

        if (initialState.onInitControls) {
            initialState.onInitControls(gameContainerDiv, game);
        }
    }

    // Re-init locations and items
    game.locations.forEach(function (location) {
        const initialLoc = initialState.locations.find(loc => loc.id === location.id);
        if (initialLoc && initialLoc.readInit) {
            initialLoc.readInit(location);
        }
    });
    game.items.forEach(function (item) {
        const initialItem = initialState.items.find(it => it.name === item.name);
        if (initialItem && initialItem.readInit) {
            initialItem.readInit(item);
        }
    });

    game.removeInputContainer = function () {
        if (headless) {
            return;
        }
        gameContainerDiv.removeChild(inputContainerDiv);
    }

    // ==============
    // Game functions
    // ==============

    // Get the location with the specified id
    game.getLocation = (id) => game.locations.find(location => location.id === id);

    // Get all available actions: global + location + inventory and location
    // items actions
    game.getActions = function (includeSystem) {
        const actions = [];
        // First global actions
        game.actions.forEach(action => {
            if (includeSystem || !action.system) {
                actions.push(action)
            }
        });
        // Location actions
        const location = game.location;
        if (location.actions) {
            location.actions.forEach(action => actions.push(action));
        }
        // Inventory + location items actions
        this.getItems().forEach(function (item) {
            if (item.actions) {
                item.actions.forEach(action => actions.push(action));
            }
        });
        return actions;
    };

    // Returns an action whose name or alias matches the specified name
    game.getAction = function (name, includeSystem) {
        let action = this.getActions(includeSystem).find(action => this.aliasObjectMatchesName(action, name));
        if (!action) {
            console.log("No action found for: " + name);
        }
        return action;
    }

    // Returns true if the specified action name/alias matches the command
    // Multi-word action names and aliases with ASCII space as a separator are supported
    game.actionNameMatchesCommand = function (name, commandParams) {
        // "use" -> ["use"]
        // "look at" -> ["look","at"]
        const parts = name.split(/\s+/);
        const command = parts.length == 1 ? commandParams[0] : commandParams.slice(0, parts.length).join(" ");
        return game.matchName(command, name);
    }

    game.getMatchingNameOrAlias = function (action, commandParams) {
        if (game.actionNameMatchesCommand(action.name, commandParams)) {
            return action.name;
        }
        if (action.aliases) {
            return action.aliases.find(alias => game.actionNameMatchesCommand(alias, commandParams));
        }
        return undefined;
    }

    game.actionMatches = function (action, params, actionName, itemName) {
        if (action.name === actionName) {
            if (itemName) {
                if (params && params.length > 0) {
                    const item = game.getItem(game.getUsableItems(), params[0]);
                    return item && game.matchName(item.name, itemName);
                } else {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    // Returns an item for the specified name or undefined
    game.mapItem = function (name) {
        return game.items.find(item => item.name === name);
    };

    // Returns an item whose name (or any of the aliases) matches the specified name, or null
    game.getItem = function (items, name, exactNameMatch = false) {
        if (items) {
            return items.find(item => (exactNameMatch ? item.name === name : this.aliasObjectMatchesName(item, name)));
        }
        return null;
    };

    // Returns true if a name or alias matches the specified name,
    // false otherwise
    game.aliasObjectMatchesName = function (obj, name) {
        if (!obj || !name) {
            return false;
        }
        if (this.matchName(name, obj.name)) {
            return true;
        }
        if (obj.aliases && obj.aliases.find(alias => this.matchName(name, alias))) {
            return true;
        }
        return false;
    };

    game.aliasObjectNameStartsWith = function (obj, str) {
        if (!obj || !str) {
            return false;
        }
        if (obj.name.startsWith(str)) {
            return true;
        }
        if (obj.aliases && obj.aliases.find(alias => alias.startsWith(str))) {
            return true;
        }
        return false;
    };

    // Returns an inventory item for the specified name or null
    game.getInventoryItem = function (name, exactNameMatch = true) {
        return game.inventory ? game.getItem(game.inventory.map(item => game.mapItem(item)), name, exactNameMatch) : undefined;
    };

    game.getInventoryItems = function () {
        return game.inventory ? game.inventory.map(item => game.mapItem(item)) : undefined;
    };

    // Remove an inventory item of the specified name if present
    game.removeInventoryItem = function (name) {
        const idx = game.inventory.findIndex(item => item === name);
        if (idx != -1) {
            game.inventory.splice(idx, 1);
        }
    }

    /**
     * Returns a location item for the specified name or undefined. Location param is optional.
     */
    game.getLocationItem = function (name, location, exactNameMatch = true) {
        const loc = location ? location : game.location;
        if (loc.items) {
            return game.getItem(loc.items.map(item => game.mapItem(item)), name, exactNameMatch);
        }
        return undefined;
    };

    // Remove an item
    game.removeItem = function (name, exactNameMatch = true) {
        const itemRet = game.findItem(name, exactNameMatch);
        if (itemRet.location) {
            game.removeLocationItem(name, itemRet.location);
            return itemRet.location;
        } else {
            game.removeInventoryItem(name);
        }
    }

    // Remove an item from the specified/current location
    game.removeLocationItem = function (name, location) {
        const loc = location ? location : game.location;
        const idx = loc.items.findIndex(item => item === name);
        if (idx != -1) {
            loc.items.splice(idx, 1);
        }
    }

    game.addLocationItem = function (itemName, locationId, skipNotification) {
        const location = locationId ? game.getLocation(locationId) : game.location;
        if (location) {
            if (!location.items) {
                location.items = [];
            }
            location.items.push(itemName);
            if (!skipNotification && game.onLocationItemAdded) {
                game.onLocationItemAdded(game, itemName);
            }
        } else {
            console.log("Location [" + locationId + "] not found");
        }
    }

    // Attempts to find an inventory/location item
    game.findItem = function (name, exactNameMatch = false) {
        let item = null;
        item = this.getInventoryItem(name, exactNameMatch);
        if (item) {
            return {
                "item": item,
                "location": null
            };
        }
        return this.findLocationItem(name, exactNameMatch);
    };

    game.findLocationItem = function (name, exactNameMatch = false) {
        for (index = 0; index < this.locations.length; index++) {
            const locItems = this.locations[index].items;
            const item = locItems ? this.getItem(locItems.map(item => game.mapItem(item)), name, exactNameMatch) : null;
            if (item) {
                return {
                    "item": item,
                    "location": this.locations[index]
                };
            }
        }
        return {};
    };

    // Return all available items (inventory + location)
    game.getItems = function () {
        const items = [];
        if (game.inventory) {
            game.inventory.forEach(i => items.push(i));
        }
        if (game.location.items) {
            game.location.items.forEach(i => items.push(i));
        }
        return items.map(item => game.mapItem(item));
    };

    game.getUsableItems = function () {
        return this.getItems().filter(item => !item.unusable);
    }

    // Return all takeable items from the current location
    game.getTakeableItems = function () {
        if (game.location.items) {
            return game.location.items.map(item => game.mapItem(item)).filter(item => item.takeable === undefined || item.takeable || item.maybeTakeable);
        }
    };

    game.removeLocationExit = function (name, location) {
        const loc = location ? location : game.location;
        const idx = loc.exits.findIndex(e => e.name === name);
        if (idx != -1) {
            loc.exits.splice(idx, 1);
        }
    }

    game.enterLocation = function (location) {
        const lastLocation = game.location;
        if (lastLocation && lastLocation.onLeave) {
            lastLocation.onLeave(game);
        }
        game.location = location;
        game.printLocationInfo(true);
        if (location.onEnter) {
            location.onEnter(game);
        }
        if (!location.explored) {
            location.explored = true;
        }
        if (game.onEnterLocation) {
            game.onEnterLocation(game, lastLocation);
        }
    };

    game.printLocationInfo = function (useTypewriter) {
        game.clearLocation();

        if (game.onLocationInfo && !game.onLocationInfo(game)) {
            // If onLocationInfo() returns false do not show the info
            return;
        }

        const location = game.location;
        const buildLocationMessage = game.buildLocationMessage;

        if (buildLocationMessage) {
            game.printLocation(buildLocationMessage(location, game), "custom")
        } else {
            if (headless) {
                game.printLocation("[" + location.id + "]");
                if (location.desc) {
                    const descStr = location.desc instanceof Function ? location.desc(game) : location.desc;
                    game.printLocation(descStr);
                }
                if (location.exits) {
                    game.printLocation(game.messages.locationExits + ": " + location.exits.map(e => e.name).join(", "));
                }
                let itemsStr = "";
                if (location.items) {
                    game.printLocation(game.messages.locationItems + ": " + location.items.map(i => game.mapItem(i).name).join(", "));
                }
            } else {
                // By default, each message is written on a separate line
                let lastLine = "";
                if (location.name) {
                    game.printLocation(location.name, "name", !useTypewriter);
                    lastLine = location.name;
                }
                if (location.desc) {
                    const descStr = location.desc instanceof Function ? location.desc(game) : location.desc;
                    game.printLocation(descStr, "desc", !useTypewriter);
                    lastLine = descStr;
                }
                if (!game.skipLocationExits && location.exits && location.exits.length > 0) {
                    const exitsStr = game.messages.locationExits + ": " + location.exits.map(e => e.name).join(", ");
                    game.printLocation(exitsStr, "exits", !useTypewriter);
                    lastLine = exitsStr;
                }
                if (!game.skipLocationItems && !location.skipLocationItems) {
                    let itemsStr = "";
                    if (location.items && location.items.length > 0) {
                        itemsStr = game.messages.locationItems + ": " + location.items.map(i => game.mapItem(i).name).join(", ");
                    } else {
                        if (location.noLocationItems) {
                            itemsStr = location.noLocationItems;
                        } else if (game.messages.noLocationItems) {
                            itemsStr = game.messages.noLocationItems;
                        }
                    }
                    game.printLocation(itemsStr, "items", !useTypewriter);
                    lastLine = itemsStr;
                }
                if (!game.skipLocationSeparator) {
                    game.printLocation("-".repeat(lastLine.length), "dashes", !useTypewriter);
                }
            }
        }
    };

    // Clear location info
    game.clearLocation = function () {
        if (headless) {
            return;
        }
        while (locationDiv.firstChild) {
            locationDiv.removeChild(locationDiv.firstChild);
        }
    };

    game.printLocation = function (text, cssClass, skipTypewriter) {
        if (headless) {
            console.log(text);
            return;
        }
        const line = document.createElement("div");
        locationDiv.appendChild(line);
        if (skipTypewriter) {
            line.textContent = text;
            if (cssClass) {
                line.className = cssClass;
            }
        } else {
            const before = cssClass ? function () {
                line.className = cssClass;
            } : undefined;
            queueOutput(line, text, before);
        }
    };

    game.print = function (text, cssClass, after) {
        if (headless) {
            console.log(text);
            return;
        }
        const line = document.createElement("div");
        const before = cssClass ? function () {
            line.className = cssClass;
        } : null;
        outputDiv.insertBefore(line, null)
        queueOutput(line, text, before, after);
    };

    game.printInputHelp = function (str, cssClass) {
        if (headless) {
            return;
        }
        const line = document.createElement("div");
        if (cssClass) {
            line.className = cssClass;
        }
        inputHelpDiv.insertBefore(line, null).innerText = str;
    };

    // Clear input help div
    game.clearInputHelp = function () {
        if (headless || game.skipInputBox) {
            return;
        }
        while (inputHelpDiv.firstChild) {
            inputHelpDiv.removeChild(inputHelpDiv.firstChild);
        }
    };

    // Clear output div
    game.clearOutput = function () {
        if (headless) {
            return;
        }
        while (outputDiv.firstChild) {
            outputDiv.removeChild(outputDiv.firstChild);
        }
    };

    game.goToLocation = function (exitName) {
        this.clearOutput();
        const location = game.location;
        const exit = location.exits.find(exit => exit.name === exitName);
        if (!exit) {
            console.log("No exit found: " + exitName);
            return false;
        } else {
            game.enterLocation(game.getLocation(exit.location));
            return true;
        }
    };

    // Prints all available actions
    game.printActions = function (prefix) {
        print(prefix + getActions().map(action => action.name).join(", "));
    };

    // Shift the time
    game.shiftTime = function (amount) {
        this.time = this.time + amount;
        if (this.onShiftTime) {
            this.onShiftTime(this);
        }
    };

    game.takeItem = function (name, updateLocationInfo = true) {
        const ret = {};
        if (game.inventoryLimit && game.inventory.length >= game.inventoryLimit) {
            if (game.messages.inventoryFull) {
                game.print(game.messages.inventoryFull);
            }
            ret.full = true;
        } else {
            const item = this.getLocationItem(name, null, false);
            if (item && (item.takeable === undefined || item.takeable)) {
                const location = this.location;
                if (!this.inventory) {
                    this.inventory = [];
                }
                location.items.splice(location.items.findIndex(it => it === item.name), 1);
                this.inventory.push(item.name);
                if (updateLocationInfo) {
                    this.printLocationInfo(false);
                }
                if (item.onTake) {
                    if (item.onTake(this)) {
                        this.printLocationInfo(false);
                    }
                }
                ret.item = item;
            }
        }
        return ret;
    };

    game.dropItem = function (name, updateLocationInfo = true) {
        const item = this.getInventoryItem(name, false);
        if (item) {
            const location = this.location;
            if (!location.items) {
                location.items = [];
            }
            location.items.push(item.name);
            game.removeInventoryItem(item.name);
            if (item.onDrop) {
                item.onDrop(game);
            }
            if (updateLocationInfo) {
                this.printLocationInfo(false);
            }
            return item;
        }
        return null;
    };

    game.useItem = function (name) {
        const item = this.getItem(this.getItems(), name);
        var ret = false;
        if (item && !item.unusable && item.onUse) {
            ret = item.onUse(game) ? true : false;
            item.used = true;
        }
        return ret;
    };

    game.examineItem = function (name) {
        const item = this.getItem(this.getItems(), name);
        if (item) {
            game.printItemInfo(item);
            if (item.onExamine) {
                item.onExamine(this);
            }
            item.examined = true;
            return true;
        }
        return false;
    };

    game.printItemInfo = function (item) {
        const foundItem = item instanceof Object ? item : this.getItem(this.getItems(), item);
        if (item) {
            this.print(item.desc instanceof Function ? item.desc(game) : item.desc);
        }
    };

    game.runOutro = function () {
        if (headless) {
            return;
        }
        if (initialState.outro) {
            while (gameContainerDiv.firstChild) {
                gameContainerDiv.removeChild(gameContainerDiv.firstChild);
            }
            outro(0, initialState.outro);
        }
    }

    game.end = function (endState, clearAll = true) {
        if (clearAll) {
            this.clearOutput();
            this.clearLocation();
        }
        if (game.onEnd) {
            game.onEnd(endState);
        } else {
            runOutro();
        }
        this.endState = endState;
    };

    // Debug function - try to find a way from one location to the other
    // location
    game.findWay = function (from, to) {
        const fromLocation = this.locations.find(loc => loc.id === from);
        const toLocation = this.locations.find(loc => loc.id === to);
        if (fromLocation && toLocation) {
            let paths = [];
            let step = 0;
            paths.push([fromLocation]);

            let newPaths;
            do {
                newPaths = this.nextStep(++step, paths, fromLocation.id, toLocation.id);
                if (newPaths.length > 0) {
                    paths = paths.concat(newPaths);
                }
            } while (newPaths.length > 0);

            const ret = [];
            for (i = 0; i < paths.length; i++) {
                const path = paths[i];
                if (path[path.length - 1].id === to) {
                    ret.push(path);
                }
            }
            for (i = 0; i < ret.length; i++) {
                let path = ret[i];
                let steps = "";
                // 1: loc1 -> exit1 -> exit2 -> loc2
                for (j = 0; j < (path.length - 1); j++) {
                    const fromStep = path[j];
                    const toStep = path[j + 1];
                    steps += "-> " + fromStep.exits.find(exit => exit.location === toStep.id).name;
                }
                console.log((i + 1) + ": " + from + " " + steps + " -> " + to);
            }
            return ret;
        } else {
            console.log("Invalid locations!");
        }
    };

    game.nextStep = function (step, paths, startId, targetId) {
        const newPathsFound = [];
        for (i = 0; i < paths.length; i++) {
            const path = paths[i];
            if (path.length === step) {
                const last = path[step - 1];
                if (path.filter(loc => loc.id === last.id).length > 1) {
                    // Cycle detected
                    continue;
                }
                if ((step === 1 || last.id != startId) && last.id != targetId && last.exits) {
                    for (j = 0; j < last.exits.length; j++) {
                        const newPath = path.slice(0);
                        newPath.push(this.locations.find(loc => loc.id === last.exits[j].location));
                        newPathsFound.push(newPath);
                    }
                }
            }
        }
        return newPathsFound;
    };

    // val - input
    // name - property to match
    game.matchName = function (val, name) {
        if (!val || !name) {
            return false;
        }
        if (this.isInputCaseSensitive) {
            if (val === name) {
                return true;
            }
            if (this.partialMatchLimit && val.length > this.partialMatchLimit) {
                return name.startsWith(val);
            }
            return false;
        } else {
            const nameUp = name.toUpperCase();
            const valUp = val.toUpperCase();
            if (valUp === nameUp) {
                return true;
            }
            if (this.partialMatchLimit && valUp.length > this.partialMatchLimit) {
                return nameUp.startsWith(valUp);
            }
            return false;
        }
    };

    game.clearAll = function () {
        this.clearLocation();
        this.clearOutput();
        this.clearInputHelp();
    }

    game.setFailState = function (msg) {
        if (game.failState) {
            return;
        }
        if (!msg && game.messages && game.messages.failState) {
            msg = " " + game.messages.failState;
        } else {
            msg = " " + msg;
        }
        game.failState = true;
        // Append message to all hints
        for (const loc of game.locations) {
            if (loc.hint) {
                loc.originalHintLength = loc.hint.length;
                loc.hint += msg;
            } else {
                loc.hint = msg;
            }
        }
    }

    game.clearFailState = function () {
        game.failState = false;
        for (const loc of game.locations) {
            if (loc.originalHintLength) {
                loc.hint = loc.hint.substring(0, loc.originalHintLength);
                loc.originalHintLength = null;
            } else {
                loc.hint = "";
            }
        }
    }

    return game;
}

function intro(index, introFuns, startFun) {
    const gameContainerDiv = document.querySelector("#game-container");
    introFuns[index](gameContainerDiv);
    document.onkeydown = function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            document.onkeydown = null;

            // Skip output queue
            skipOutputEffects();
            outputQueue.splice(0, outputQueue.length);
            resetOutputQueueStatus();

            if (introFuns.length > (index + 1)) {
                intro(index + 1, introFuns, startFun);
            } else {
                startFun();
            }
        }
    }
}

function outro(index, outroFuns) {
    const gameContainerDiv = document.querySelector("#game-container");
    outroFuns[index](gameContainerDiv);
    document.onkeydown = function (e) {
        if (e.key === "Enter") {
            document.onkeydown = null;

            // TODO does not work for some reason 
            // Skip output queue
            // skipOutputEffects();
            // outputQueue.splice(0, outputQueue.length);
            // resetOutputQueueStatus();

            if (outroFuns.length > (index + 1)) {
                intro(index + 1, outroFuns);
            } else {
                document.onkeydown = function (e) {
                    if (event.key === "r") {
                        // Restart game
                        location.reload();
                    }
                }
            }
        }
    }
}

// TODO add some impl notes
const outputQueue = [];
let currentOutput = null;
let skipOutputQueue = false;
const typewriterDelay = 20;
let outputIntervalId = null;

function queueOutput(element, text, before, after, htmlContent) {
    if (!text) {
        console.log("Not enqueued - no text specified");
        return;
    }
    const item = new Object();
    item.element = element;
    item.text = text;
    item.before = before;
    item.after = after;
    item.htmlContent = htmlContent;
    outputQueue.push(item);
    // console.log("Output queued [" + outputQueue.length + "]: " + text);
}

function initOutputQueue() {
    if (outputIntervalId) {
        clearInterval(outputIntervalId);
    }
    outputIntervalId = setInterval(function () {
        // console.log("Process queue [" + outputQueue.length + "]");
        if (currentOutput) {
            return;
        }
        const next = outputQueue.shift();
        if (next) {
            currentOutput = next;
            if (next.before) {
                next.before();
            }
            if (skipOutputQueue || next.htmlContent) {
                if (next.htmlContent) {
                    next.element.innerHTML = next.text;
                } else {
                    next.element.textContent = next.text;
                }
                if (next.after) {
                    next.after();
                }
                resetOutputQueueStatus();
            } else {
                typewriter(next.element, next.text, 0, function () {
                    if (next.after) {
                        next.after();
                    }
                    resetOutputQueueStatus();
                });
            }
        } else {
            resetOutputQueueStatus();
        }
    }, 300);
}

function resetOutputQueueStatus() {
    currentOutput = null;
    if (outputQueue.length === 0) {
        skipOutputQueue = false;
    }
}

function isOutputQueueProcessed() {
    return currentOutput;
}

function skipOutputEffects() {
    console.log("Skip output queue");
    skipOutputQueue = true;
}

function typewriter(element, text, idx, followup) {
    let indexVal = idx ? idx++ : 0;
    const textVal = text.slice(0, ++indexVal);
    element.textContent = textVal;
    if (text.length > indexVal) {
        if (skipOutputQueue) {
            element.textContent = text;
            followup();
        } else {
            const next = function () {
                typewriter(element, text, indexVal, followup);
            }
            setTimeout(next, 10);
        }
    } else {
        if (followup) {
            followup();
        }
    }
}