const bundle = {
    // =====
    // Items
    // =====
    item_diamonds_name: "diamonds",
    item_diamonds_desc: "Four beautiful gems.",
    item_diamonds_onDrop: "As soon as you put them down, someone has snatched them from the altar.",

    item_cop1_name: "cop",
    item_cop1_desc: "He's about to beat you up.",
    
    item_corpse1_name: "dead cop",
    item_corpse1_desc: "The axe has cut down deep inside his skull (good job)! He's equipped with a shield.",

    item_shield_name: "shield",
    item_shield_desc: "It is designed to shield you from falling rocks.",
    item_shield_onUse: "O.K. You have used the shield to deflect the rock.",

    item_stone_name: "stone",
    item_stone_aliases: ["rock"],
    item_stone_desc: "It's no ordinary rock, it's a cobblestone.",
    item_stone_onUse: "You have cast the rock to the right. You have heard a scream (and that is intriguing) from the right.",

    item_tail_name: "tail",
    item_tail_desc: "It's the tail of St. Wenceslas' horse.",
    item_tail_onExamine: "You've found an axe in a little crevice below the tail.",

    item_axe_name: "axe",
    item_axe_desc: "It would cut cops' stupid heads like butter.",
    item_axe_onUse: "O.K. You've driven your axe so deep inside his skull that it cannot be pulled out.",

    item_dictionary_name: "dictionary",
    item_dictionary_desc: "A comprehensive Czech-English dictionary.",
    item_dictionary_onUse: "O.K. You've translated the writing on the wall. It says that the General Secretary Jakeš 'is a dumbass'. It's signed KAREL.",

    item_writing_name: "writing",
    item_writing_aliases: ["writing on the wall"],
    item_writing_desc: "You won't decipher it without a dictionary.",

    item_gun_name: "pistol",
    item_gun_desc: "There's no ammunition, unfortunately.",

    item_cop2_name: "policeman",
    item_cop2_desc: "He's about to beat you up.",

    item_corpse2_name: "dead policeman",
    item_corpse2_desc: "Apparatently, he has been hit by a cobblestone.",

    item_rod_name: "rod",
    item_rod_desc: "It could come in handy.",
    item_rod_onUse_cop2: "O.K. You have pried the drain cover open, and it fell down into the manhole. Screaming, the cop charged at you, but at the very moment he was about to hit you, he dropped down the open manhole right in front of you.",
    item_rod_onUse_cop3: "O.K. You have hit the cop with the iron rod, right into the head.",
    item_rod_onUse_throw: "O.K. You have hurled the rod to the left and heard a groan. Ha ha ha ha.",

    item_cop3_name: "copper",
    item_cop3_desc: "He's about to beat you up.",

    item_corpse3_name: "dead copper",
    item_corpse3_desc: "A uniformed cop. Someone (guess who?) has split his skull with an iron rod.",

    item_uniform_name: "uniform",
    item_uniform_desc: "It's the uniform of a member of the Public Security, or the Czechoslovak police.",
    item_uniform_dress_action_name: "wear",
    item_uniform_dress_action_aliases: ["put on"],
    item_uniform_dress_action_perform: "O.K. You've put on the police uniform.",
    item_uniform_undress_action_name: "remove",
    item_uniform_undress_action_aliases: ["put down", "take off"],
    item_uniform_undress_action_perform: "O.K. You've taken off the uniform.",

    item_cop4_name: "member of the police force",
    item_cop4_aliases: ["police", "member"],
    item_cop4_desc: "He's checking the passersby.",

    item_altar_name: "altar",
    item_altar_desc: "As if something was telling you: Put the diamonds here.",

    item_tag_name: "note",
    item_tag_desc: "It reads: 'Only the one who has four magic diamonds will make it out of here.'",

    item_civilian_name: "civilian",
    item_civilian_desc: "He's obviously not fond of communists.",

    item_cop5_name: "police officer",
    item_cop5_aliases: ["officer"],
    item_cop5_desc: "He's about to beat you up.",

    item_civilian_corpse_name: "dead civilian",
    item_civilian_corpse_desc: "He looks very much like you. He's got an ID card on him.",

    item_idcard_name: "ID card",
    item_idcard_aliases: ["card"],
    item_idcard_desc: "It belongs to the member of the secret police who looks very much like you.",

    item_militiaman_corpse_name: "dead militiaman",
    item_militiaman_corpse_aliases: ["mrtvolu milicionare"],
    item_militiaman_corpse_desc: "Someone has thrown an iron bar at him, guessing from the fact that it is sticking out of his head.",

    item_spinach_name: "spinach",
    item_spinach_desc: "A can of spinach. It's still before its best before date.",
    item_spinach_onUse: "O.K. You've eaten the spinach and you suddenly feel stronger - strong enough to throw javelin.",

    item_can_name: "can",
    item_can_desc: "It's a spinach can, licked completely clean.",

    // =========
    // Locations
    // =========

    location_m1_desc: "O.K. You're standing in front of the Grocery Store Building. The entrance into the subway is fortunately clear. An annoying man (probably a communist) is looking out of a balcony and happily watching the good work of the members of the Public Security.",
    location_m1_hint: "You will have to chop your way through.",
    location_m1_kill: "The bloodthirsty cop has grabbed you and started beating you up. And kept on beating and beating...",

    location_m2_desc: "O.K. You're under the statue of St. Wenceslas. The entrance into the subway is blocked. The National Museum is above you, but the entryway is also blocked.",
    location_m2_hint: "Take a good look around you.",

    location_m3_desc_ok: "O.K. You're standing at an unobstructed entrance into the subway. As soon as you showed up, an officer came to you and searched you. Having found the secret police ID card, he wished you good luck in your future endeavors, bowed, and left (the moron!).",
    location_m3_desc_nok: "O.K. You're standing at an unobstructed entrance into the subway. As soon as you showed up, an officer came to you and searched you. Having found nothing, he called on his “comrades” and they beat you senseless.",
    location_m3_kill: "Když od tebe odbíhali na nějakou ženu s kočárkem, jednomu z nich vypadla z pouzdra mačeta. Doplazil ses pro ni a spáchals' HARAKIRI.",
    location_m3_hint: "Nothing keeps you from departing now.",

    location_m4_desc: "O.K. You're standing by the Supraphon record store. But before you could even look around, you have been hit by a water cannon.",
    location_m4_kill: "You fell down and struck your head on the ground.",

    location_m5_desc: "O.K. You're taking a leak among the flowers in a big flowerpot.",
    location_m5_hint: "One of the cops is likely to have something that can deflect the rock. Such a rock can hit a fairly distant target.",
    location_m5_kill: "The stone is getting closer and closer to you. It keeps getting bigger and bigger and big-",
    location_m5_stone: "stone that is about to hit you,",

    location_m6_desc: "O.K. You're standing by the Fashion Building, next to the barricaded Krakovská street.",
    location_m6_hint: "This cop will be of no more use to you.",
    location_m6_kill: "You see a cop. His face, which is getting closer and closer to you, is maniacal. There is no escaping him.",

    location_m7_desc: "O.K. You're standing in front of a bookstore. You cannot hear anything, because a large crowd keeps chanting the slogan 'LONG LIVE KAREL!' To the left, you can see a blocked entrance into Opletalova street.",
    location_m7_hint: "A gun won't help you in Wencleslas Square.",

    location_m8_desc: "O.K. You're standing between traffic posts, right by a drain. There is nothing special here. There are roadblocks downward.",
    location_m8_hint: "Could the drain be of any use?",
    location_m8_kill: "As soon as the cop spotted you, he charged at you. You didn't even put up a fight. You loser.",

    location_m9_desc: "O.K. You are standing under the scaffolding. There are roadblocks downward. You can hear a quiet, yet suspicious ticking. You can see the blocked entrance into the Ve Smečkách street.",
    location_m9_desc_exploded: "O.K. You're balancing on the edge of a huge crater. At the bottom, you can see a sign saying 'The Fashion Building'.",
    location_m9_hint: "Can you hear the ticking? Pick up what you can, and scram!",
    location_m9_kill: "You couldn't keep balance though, and you're falling down.",
    location_m9_bomb_kill: "You noticed a flash, followed by a massive explosion. Right before a shard hit you, you've realized what the ticking was.",
    location_m9_bomb_exploded: "The spot that you've just left, has now exploded. Lucky you!",
    location_m9_bomb_hint: "The explosion destroyed an object that you required to finish the game. Type in RESTART to try again.",

    location_m10_desc: "O.K. You find yourself in front of the Luxol Club. The Jalta cinema is next door. You can see roadblocks further down.",
    location_m10_hint: "Some items will help you more than once. And don't forget to dress up for each occasion!",
    location_m10_enter_ok: "Suddenly, the cop charged at you, and having found nothing, he left with a frown.",
    location_m10_enter_kill: "Suddenly, the cop charged at you. He frisked you, and as soon as he found the pistol on you, he shot you dead on the spot.",
    location_m10_kill: "Not finding what he was looking for, the policeman lost his nerve and beat you up.",

    location_m11_desc: "O.K. You're in the shrubs.",
    location_m11_hint: "Someone likes uniforms, someone doesn't.",
    location_m11_kill: "A member of the Public Security tackled you and dragged you into an armed truck. Sitting here are some fine young men with iron bars in their hands. They start to play with you.",

    location_m12_desc: "O.K. You're standing in front of a bank. There are roadblocks uphill.",
    location_m12_hint: "The note does not lie!",

    location_m13_desc: "O.K. You're in front of the Grand Hotel EVROPA. But then you notice a video camera pointed right at you.",
    location_m13_kill: "You've concluded that resistance is futile and committed suicide.",

    location_m14_desc: "O.K. You're sitting on a bench. (You can't keep up, can you?) A bullet just swooshed past your ear. There are roadblocks up ahead.",
    location_m14_desc_cops: "A group of policemen are coming toward you.",
    location_m14_hint: "Some dangers you can simply avoid.",
    location_m14_kill: "The policemen approached you. Before you managed to get up, they were already beating you with batons.",

    location_m15_desc: "O.K. You're standing under a scaffolding. To the right, the way into Štěpánská street is blocked. There are roadblocks downhill, too.",
    location_m15_hint: "If you don't have enough room in your pockets, you'll have to change clothes often!",
    location_m15_kill: "A civilian charged at you thinking that you are with the Public Security. That's because you're still wearing the uniform.",

    location_m16_desc: "O.K. You are lying on the ground in front of the COMRADERIE department store. That's because an officer has just hit you. The entrace into the metro is blocked. There are tram tracks further down behind roadblocks.",
    location_m16_hint: "Bribery is the enemy of socialism - but it works!",
    location_m16_kill: "The officer charged at you and beat you up.",
    location_m16_cop_left: "The officer accepted the deal and quietly left.",

    location_m17_desc_unexplored: "O.K. You're sitting next to some flowers in a flowerpot and a militiaman is shouting at you. To quote: 'If I see you here again, you're a dead man.",
    location_m17_desc_explored_ok: "O.K. You're sitting next to some flowers in a flowerpot.",
    location_m17_desc_explored_nok: "O.K. You're sitting next to some flowers in a flowerpot and the militia man is shouting at you. To quote: 'I've warned you, you fucker.'",
    location_m17_kill: "As soon as he was done talking, he charged at you.",
    location_m17_hint: "The militiaman is being serious!",

    location_m18_desc: "O.K. You're standing by a blocked entrance into the subway. There are roadblocks up- and downhill.",
    location_m18_hint: "To throw anywhere far, you'll need some energy.",

    location_m19_desc: "O.K. You've entered the subway. There's teargas everywhere.",
    location_m19_kill: "There's so much of it here that you've suffocated.",

    // =======
    // Actions
    // =======

    exit_up: "up",
    exit_up_aliases: ["u"],
    exit_down: "down",
    exit_down_aliases: ["d"],
    exit_right: "right",
    exit_right_aliases: ["r"],
    exit_left: "left",
    exit_left_aliases: ["l"],
    exit_inside: "inside",
    exit_inside_aliases: [],

    action_explore: "examine",
    action_explore_aliases: ["look at"],

    action_use: "use",
    action_use_aliases: [],

    action_drop: "drop",
    action_drop_aliases: ["put down", "throw away"],
    action_drop_success: "You have dropped the ",
    action_drop_fail: "You can't drop that.",

    action_take: "take",
    action_take_aliases: ["pick up"],
    action_take_success: "You have picked up the ",
    action_take_fail: "You can't pick this up.",

    action_inventory: "inventory",
    action_inventory_aliases: ["things", "i"],
    action_inventory_start: "You're holding ",
    action_inventory_end: ", nothing more, nothing less.",
    action_inventory_empty: "You don't have shit.",

    action_dict: "vocabulary",
    action_dict_aliases: ["verbs", "actions"],
    action_dict_prefix: "You can use the following verbs: ",

    action_help: "help",
    action_help_aliases: ["hint"],

    // ======
    // Global
    // ======

    start_hint: 'Enter a command, such as "examine tail". To auto-complete commands, try pressing TAB.',

    // Controls
    controls_autocomplete: "Special key - auto-complete command",
    controls_history_old: "Special key - show previous command",
    controls_history_new: "Special key - show next command",
    controls_save: "Command - save game",
    controls_load: "Command - load game",

    // Messages
    messages_locationItems: "You see",
    messages_locationExits: "You can go",
    messages_unknownCommand: "You can't do that!!!",
    messages_multipleActionsMatch: "The input corresponds to multiple commands: ",
    messages_inputHelpPrefix: "Continue: ",
    messages_gameSaved: "Game saved.",
    messages_gameLoaded: "Savegame loaded.",
    messages_gamePositions: "Following savegames are available: ",
    messages_gamePositionsEmpty: "No savegames available.",
    messages_gamePositionDoesNotExist: "Cannot load savegame: ",
    messages_inventoryFull: "You cannot carry anything more!",

    // Intro
    intro_img_title_path: "../img/title.png",

    intro_enter: "Press ENTER",
    intro_text1_a: "THE ADVENTURES OF INDIANA JONES",
    intro_text1_b: "IN WENCESLAS SQUARE",
    intro_text1_c: "IN PRAGUE",
    intro_text1_d: "ON JANUARY 16, 1989",

    intro_text1: "You are Indiana Jones and your goal is to get to your homeland, America. Incidentally, you find yourself on Wenceslas Square under the statue of St. Wenceslas. The date is January 16, 1989.",
    intro_text2: "This game is designed for advanced adventure game players.",
    intro_textAdd: "Yours sincerely,",
    intro_textAdd1: "Zuzan Znovuzrozený",
    intro_textAdd2: "Zillion and One Overlooked Street",
    intro_textAdd3: "Zero City",
    intro_textAdd4: "NOWHERELAND",
    intro_textPhone: "Phone no.: 16 1 1989",
    intro_textMilos: "BEAT 'EM UP!!!",

    end_killed1: "INDIANA JONES IS DEAD!",
    end_killed2: "BREAKING NEWS FROM AMERICAN PRESS: The Czechoslovak government has announced that our dear hero - INDIANA JONES - died in a traffic accident with no signs of foul play. Continue reading on page 54.",
    end_killed3: "Press R to RESTART or L to LOAD the latest savegame.",
    end_win: "O.K. YOU HAVE OUTSMARTED EVEN THE WORST POLICE SCUM. YOU HAVE SAFELY ARRIVED AT THE AIRPORT AND TOOK A PLANE HOME. CONGRATULATIONS!!!!!!!!!!",
    end_win_restart: "Press R to RESTART",
}