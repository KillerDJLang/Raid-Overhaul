import { container }          from "tsyringe";

import { DatabaseServer }     from "@spt-aki/servers/DatabaseServer";
import { JsonUtil }           from "@spt-aki/utils/JsonUtil";
import { HashUtil }           from "@spt-aki/utils/HashUtil";
import { ConfigServer }       from "@spt-aki/servers/ConfigServer";
import { CustomItemService }  from "@spt-aki/services/mod/CustomItemService";
import { ConfigTypes }        from "@spt-aki/models/enums/ConfigTypes";
import { IRagfairConfig }     from "@spt-aki/models/spt/config/IRagfairConfig";

import { Utils }              from "../Refs/Utils";
import { HandbookIDs,
         ItemGenIDs,
         AllItemList }        from "../Refs/Enums";

export class ItemGenerator
{

  constructor(private utils: Utils) 
  {}

    public createWeapons(): void
    {
      const tables =        container.resolve<DatabaseServer>("DatabaseServer").getTables();
      const jsonUtil =      container.resolve<JsonUtil>("JsonUtil");
      const hashUtil =      container.resolve<HashUtil>("HashUtil");
      const newItem =       container.resolve<CustomItemService>("CustomItemService");
      const configServer =  container.resolve<ConfigServer>("ConfigServer");
      const ragfair =       configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

      //#region Aug762
      this.utils.createItem({
        newItem: {
            ItemToClone: ItemGenIDs.Aug,
            newID: "Aug762a",
            OverrideProperties: {
                Chambers: [
                    {
                        "_name": "patron_in_weapon",
                        "_id": hashUtil.generate(),
                        "_parent": "Aug762a",
                        "_props": {
                            "filters": [
                                {
                                    "Filter": [
                                        "59e0d99486f7744a32234762", //762x39
                                        "59e4d3d286f774176a36250a",
                                        "5656d7c34bdc2d9d198b4587",
                                        "59e4cf5286f7741778269d8a",
                                        "59e4d24686f7741776641ac7",
                                        "601aa3d2b2bcb34913271e6d",
                                        "64b7af5a8532cf95ee0a0dbd",
                                        "64b7af434b75259c590fa893",
                                        "64b7af734b75259c590fa895"
                                    ]
                                }
                            ]
                        },
                        "_required": false,
                        "_mergeSlotWithChildren": false,
                        "_proto": "55d4af244bdc2d962f8b4571"
                    }
                ],
                ConflictingItems: [
                    "59e6920f86f77411d82aa167",
                    "59e6927d86f77411da468256",
                    "54527a984bdc2d4e668b4567",
                    "54527ac44bdc2d36668b4567",
                    "59e68f6f86f7746c9f75e846",
                    "59e6906286f7746c9f75e847",
                    "59e690b686f7746c9f75e848",
                    "59e6918f86f7746c9f75e849",
                    "60194943740c5d77f6705eea",
                    "601949593ae8f707c4608daa",
                    "5c0d5ae286f7741e46554302",
                    "5fbe3ffdf8b6a877a729ea82",
                    "5fd20ff893a8961fc660a954",
                    "619636be6db0f2477964e710",
                    "6196364158ef8c428c287d9f",
                    "6196365d58ef8c428c287da1",
                    "64b8725c4b75259c590fa899"
                ],
                Slots: [
                    {
                      "_id": "63171672192e68c5460cebc6",
                      "_mergeSlotWithChildren": false,
                      "_name": "mod_magazine",
                      "_parent": "Aug762a",
                      "_props": {
                        "filters": [
                          {
                            "AnimationIndex": -1,
                            "Filter": [
                              "Aug30Maga",
                              "Aug42Maga"
                            ]
                          }
                        ]
                      },
                      "_proto": "55d30c394bdc2dae468b4577",
                      "_required": false
                    },
                    {
                      "_id": "62e7c6b6da5b3b57e805e2c9",
                      "_mergeSlotWithChildren": false,
                      "_name": "mod_charge",
                      "_parent": "Aug762a",
                      "_props": {
                        "filters": [
                          {
                            "Filter": [
                              "62e7c880f68e7a0676050c7c",
                              "62ebbc53e3c1e1ec7c02c44f"
                            ],
                            "Shift": 0
                          }
                        ]
                      },
                      "_proto": "55d30c4c4bdc2db4468b457e",
                      "_required": true
                    },
                    {
                      "_id": "62e7c6b6da5b3b57e805e2ca",
                      "_mergeSlotWithChildren": false,
                      "_name": "mod_reciever",
                      "_parent": "Aug762a",
                      "_props": {
                        "filters": [
                          {
                            "Filter": [
                              "62e7c72df68e7a0676050c77",
                              "62ea7c793043d74a0306e19f"
                            ],
                            "Shift": 0
                          }
                        ]
                      },
                      "_proto": "55d30c4c4bdc2db4468b457e",
                      "_required": true
                    }
                  ],  
                ammoCaliber: "Caliber762x39",
                defAmmo: "64b7af5a8532cf95ee0a0dbd",
                defMagType: "Aug762Maga"
            },
            LocalePush: {
              Name: "Modified AUG A3 7.62x39 assault rifle",
              ShortName: "AUG 762",
              Description: "Steyr AUG A3 is a 5.56x45 bullpup assault rifle, developed by the Austrian company Steyr-Daimler-Puch. AUG is known for good ergonomics, decent accuracy, low recoil and sufficient reliability. The rifle also stands out for its futuristic design. The A3 version features a bolt-catch button. This rifles has been modified to be compatible with 7.62x39mm caliber ammunition while retaining it's standout characteristics."
            },
            HandbookParent: HandbookIDs.MarksmanRifles,
            HandbookPrice: 61999,
            PushMastery: true,
            AddToBots: false,
            BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.AugMag,
            newID: "Aug30Maga",
            OverrideProperties: {
              Cartridges: [
                  {
                    "_name": "cartridges",
                    "_id": hashUtil.generate(),
                    "_max_count": 30,
                    "_parent": "Aug30Maga",
                    "_props": 
                      {"filters": [
                        {
                          "Filter": [
                            "59e0d99486f7744a32234762",
                            "59e4d3d286f774176a36250a",
                            "5656d7c34bdc2d9d198b4587",
                            "59e4cf5286f7741778269d8a",
                            "59e4d24686f7741776641ac7",
                            "601aa3d2b2bcb34913271e6d",
                            "64b7af5a8532cf95ee0a0dbd",
                            "64b7af434b75259c590fa893",
                            "64b7af734b75259c590fa895"
                        ]
                      }
                    ]
                  },
                  "_proto": "5748538b2459770af276a261"
                }
              ]
            },
            LocalePush: {
              Name: "Steyr AUG 7.62x39 30-round magazine",
              ShortName: "AUG",
              Description: "A 30-round polymer Steyr AUG magazine, for 7.62x39 ammunition."
            },
            HandbookParent: HandbookIDs.Magazines,
            HandbookPrice: 11999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.AugExtMag,
            newID: "Aug42Maga",
            OverrideProperties: {
              Cartridges: [
                  {
                    "_name": "cartridges",
                    "_id": hashUtil.generate(),
                    "_max_count": 42,
                    "_parent": "Aug42Maga",
                    "_props": 
                      {"filters": [
                        {
                          "Filter": [
                            "59e0d99486f7744a32234762",
                            "59e4d3d286f774176a36250a",
                            "5656d7c34bdc2d9d198b4587",
                            "59e4cf5286f7741778269d8a",
                            "59e4d24686f7741776641ac7",
                            "601aa3d2b2bcb34913271e6d",
                            "64b7af5a8532cf95ee0a0dbd",
                            "64b7af434b75259c590fa893",
                            "64b7af734b75259c590fa895"
                        ]
                      }
                    ]
                  },
                  "_proto": "5748538b2459770af276a261"
                }
              ]
            },
            LocalePush: {
              Name: "Steyr AUG 7.62x39 42-round magazine",
              ShortName: "AUG",
              Description: "A 42-round polymer Steyr AUG magazine, for 7.62x39 ammunition."
            },
            HandbookParent: HandbookIDs.Magazines,
            HandbookPrice: 19999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        newItem.addToWeaponShelf("Aug762a");
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "Aug762a", 5);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "Aug30Maga", 10);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "Aug42Maga", 3);

        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "Aug762a", 5);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "Aug30Maga", 10);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "Aug42Maga", 3);

        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "Aug762a", 5);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "Aug30Maga", 10);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "Aug42Maga", 3);

        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "Aug762a", 5);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "Aug30Maga", 10);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "Aug42Maga", 3);

        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "Aug762a", 5);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "Aug30Maga", 10);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "Aug42Maga", 3);
      //#endregion
      //
      //
      //
      //#region MCM4
      this.utils.createItem({
        newItem: {
            ItemToClone: ItemGenIDs.M4,
            newID: "MCM4",
            OverrideProperties: {
                Chambers: [
                    {
                      "_id": hashUtil.generate(),
                      "_mergeSlotWithChildren": false,
                      "_name": "patron_in_weapon",
                      "_parent": "MCM4",
                      "_props": {
                        "filters": [
                          {
                            "Filter": [
                                "5c0d5e4486f77478390952fe", //545x39
                                "61962b617c6c7b169525f168",
                                "56dfef82d2720bbd668b4567",
                                "56dff026d2720bb8668b4567",
                                "56dff061d2720bb5668b4567",
                                "56dff0bed2720bb0668b4567",
                                "56dff216d2720bbd668b4568",
                                "56dff2ced2720bb4668b4567",
                                "56dff338d2720bbd668b4569",
                                "56dff3afd2720bba668b4567",
                                "56dff421d2720b5f5a8b4567",
                                "56dff4a2d2720bbd668b456a",
                                "56dff4ecd2720b5f5a8b4568",

                                "59e6920f86f77411d82aa167", //556x54
                                "59e6927d86f77411da468256",
                                "54527a984bdc2d4e668b4567",
                                "54527ac44bdc2d36668b4567",
                                "59e68f6f86f7746c9f75e846",
                                "59e6906286f7746c9f75e847",
                                "59e690b686f7746c9f75e848",
                                "59e6918f86f7746c9f75e849",
                                "60194943740c5d77f6705eea",
                                "601949593ae8f707c4608daa",
                                "5c0d5ae286f7741e46554302",

                                "5fbe3ffdf8b6a877a729ea82", //300blackout
                                "5fd20ff893a8961fc660a954",
                                "619636be6db0f2477964e710",
                                "6196364158ef8c428c287d9f",
                                "6196365d58ef8c428c287da1",
                                "64b8725c4b75259c590fa899",

                                "59e0d99486f7744a32234762", //762x39
                                "59e4d3d286f774176a36250a",
                                "5656d7c34bdc2d9d198b4587",
                                "59e4cf5286f7741778269d8a",
                                "59e4d24686f7741776641ac7",
                                "601aa3d2b2bcb34913271e6d",
                                "64b7af5a8532cf95ee0a0dbd",
                                "64b7af434b75259c590fa893",
                                "64b7af734b75259c590fa895",

                                "5c0d688c86f77413ae3407b2", //9x39
                                "61962d879bb3d20b0946d385",
                                "57a0dfb82459774d3078b56c",
                                "57a0e5022459774d1673f889",
                                "5c0d668f86f7747ccb7f13b2",
                                "6576f96220d53a5b8f3e395e",

                                "5cc80f53e4a949000e1ea4f8", //57
                                "5cc86832d7f00c000d3a6e6c",
                                "5cc86840d7f00c002412c56c",
                                "5cc80f67e4a949035e43bbba",
                                "5cc80f38e4a949001152b560",
                                "5cc80f8fe4a949033b0224a2",
                                "5cc80f79e4a949033c7343b2"
                            ]
                          }
                        ]
                      },
                      "_proto": "55d4af244bdc2d962f8b4571",
                      "_required": false
                    }
                ],
                Slots: [
                    {
                      "_id": "55d354084bdc2d8c2f8b4568",
                      "_mergeSlotWithChildren": false,
                      "_name": "mod_pistol_grip",
                      "_parent": "MCM4",
                      "_props": {
                        "filters": [
                        {
                            "Filter": [
                            "5c0e2ff6d174af02a1659d4a",
                            "5a33e75ac4a2826c6e06d759",
                            "55d4b9964bdc2d1d4e8b456e",
                            "571659bb2459771fb2755a12",
                            "602e71bd53a60014f9705bfa",
                            "6113c3586c780c1e710c90bc",
                            "6113cc78d3a39d50044c065a",
                            "6113cce3d92c473c770200c7",
                            "5cc9bcaed7f00c011c04e179",
                            "5bb20e18d4351e00320205d5",
                            "5bb20e0ed4351e3bac1212dc",
                            "6193dcd0f8ee7e52e4210a28",
                            "5d025cc1d7ad1a53845279ef",
                            "5c6d7b3d2e221600114c9b7d",
                            "57c55efc2459772d2c6271e7",
                            "57af48872459771f0b2ebf11",
                            "57c55f092459772d291a8463",
                            "57c55f112459772d28133310",
                            "57c55f172459772d27602381",
                            "5a339805c4a2826c6e06d73d",
                            "55802f5d4bdc2dac148b458f",
                            "5d15cf3bd7ad1a67e71518b2",
                            "59db3a1d86f77429e05b4e92",
                            "5fbcbd6c187fea44d52eda14",
                            "59db3acc86f7742a2c4ab912",
                            "59db3b0886f77429d72fb895",
                            "615d8faecabb9b7ad90f4d5d",
                            "5b07db875acfc40dc528a5f6",
                            "63f5feead259b42f0b4d6d0f",
                            "652911675ae2ae97b80fdf3c"
                            ],
                            "Shift": 0
                        }
                        ]
                    },
                    "_proto": "55d30c4c4bdc2db4468b457e",
                    "_required": true
                    },
                    {
                      "_id": hashUtil.generate(),
                      "_mergeSlotWithChildren": false,
                      "_name": "mod_magazine",
                      "_parent": "MCM4",
                      "_props": {
                        "filters": [
                          {
                            "AnimationIndex": -1,
                            "Filter": [
                              "55d4887d4bdc2d962f8b4570",
                              "61840bedd92c473c77021635",
                              "61840d85568c120fdd2962a5",
                              "5c05413a0db834001c390617",
                              "5c6d450c2e221600114c997d",
                              "5c6d42cb2e2216000e69d7d1",
                              "59c1383d86f774290a37e0ca",
                              "5aaa5e60e5b5b000140293d6",
                              "5448c1d04bdc2dff2f8b4569",
                              "5aaa5dfee5b5b000140293d3",
                              "5d1340b3d7ad1a0b52682ed7",
                              "544a378f4bdc2d30388b4567",
                              "5d1340bdd7ad1a0e8d245aab",
                              "55802d5f4bdc2dac148b458e",
                              "5d1340cad7ad1a0b0b249869",
                              "6241c2c2117ad530666a5108",
                              "5c6592372e221600133e47d7",
                              "544a37c44bdc2d25388b4567",
                              ItemGenIDs.Battlemag,
                              "MCM4300Mag",
                              "MCM4939Mag",
                              "MCM4545Mag",
                              "MCM4762Mag",
                              "MCM457Mag"
                            ]
                          }
                        ]
                      },
                      "_proto": "55d30c394bdc2dae468b4577",
                      "_required": false
                    },
                    {
                      "_id": hashUtil.generate(),
                      "_mergeSlotWithChildren": false,
                      "_name": "mod_reciever",
                      "_parent": "MCM4",
                      "_props": {
                        "filters": [
                          {
                            "Filter": [
                              "5c0e2f26d174af02a9625114",
                              "55d355e64bdc2d962f8b4569",
                              "5d4405aaa4b9361e6a4e6bd3",
                              "5c07a8770db8340023300450",
                              ItemGenIDs.Murs,
                              "63f5ed14534b2c3d5479a677",
                              "MCM4300",
                              "MCM4939",
                              "MCM4545",
                              "MCM4762",
                              "MCM457"
                            ],
                            "Shift": 0
                          }
                        ]
                      },
                      "_proto": "55d30c4c4bdc2db4468b457e",
                      "_required": true
                    },
                    {
                      "_id": "55d5a3074bdc2d61338b4574",
                      "_mergeSlotWithChildren": false,
                      "_name": "mod_stock",
                      "_parent": "MCM4",
                      "_props": {
                        "filters": [
                          {
                            "Filter": [
                              "5a33ca0fc4a282000d72292f",
                              "5c0faeddd174af02a962601f",
                              "5649be884bdc2d79388b4577",
                              "5d120a10d7ad1a4e1026ba85",
                              "5b0800175acfc400153aebd4",
                              "5947e98b86f774778f1448bc",
                              "5947eab886f77475961d96c5",
                              "602e3f1254072b51b239f713",
                              "5c793fb92e221644f31bfb64",
                              "5c793fc42e221600114ca25d",
                              "591aef7986f774139d495f03",
                              "591af10186f774139d495f0e",
                              "627254cc9c563e6e442c398f",
                              "638de3603a1a4031d8260b8c"
                            ],
                            "Shift": 0
                          }
                        ]
                      },
                      "_proto": "55d30c4c4bdc2db4468b457e",
                      "_required": true
                    },
                    {
                      "_id": "55d5a30f4bdc2d882f8b4574",
                      "_mergeSlotWithChildren": false,
                      "_name": "mod_charge",
                      "_parent": "MCM4",
                      "_props": {
                        "filters": [
                          {
                            "Filter": [
                              "5c0faf68d174af02a96260b8",
                              "56ea7165d2720b6e518b4583",
                              "55d44fd14bdc2d962f8b456e",
                              "5ea16d4d5aad6446a939753d",
                              "5bb20dbcd4351e44f824c04e",
                              "6033749e88382f4fab3fd2c5",
                              "5b2240bf5acfc40dc528af69",
                              "5d44334ba4b9362b346d1948",
                              "5f633ff5c444ce7e3c30a006",
                              "651bf5617b3b552ef6712cb7"
                            ],
                            "Shift": 0
                          }
                        ]
                      },
                      "_proto": "55d30c4c4bdc2db4468b457e",
                      "_required": true
                    }
                ]
            },
            LocalePush: 
            {
              Name: "Multi-Calibre M4A1 Assault Rifle",
              ShortName: "MCM4",
              Description: "A Multi-Calibre variant of the standard M4A1 assault rifle. Modified to be compatible with 5.45, 5.56, 5.7, .300, 7.62 and 9x39 ammunition with the accompanying receivers."
            },
            HandbookParent: HandbookIDs.AssaultRifles,
            HandbookPrice: 51999,
            PushMastery: true,
            AddToBots: false,
            BotLootItemToClone: "",
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.Murs,
            newID: "MCM457",
            OverrideProperties: {
                ConflictingItems: [
                    "5c0d5e4486f77478390952fe", //545x39
                    "61962b617c6c7b169525f168",
                    "56dfef82d2720bbd668b4567",
                    "56dff026d2720bb8668b4567",
                    "56dff061d2720bb5668b4567",
                    "56dff0bed2720bb0668b4567",
                    "56dff216d2720bbd668b4568",
                    "56dff2ced2720bb4668b4567",
                    "56dff338d2720bbd668b4569",
                    "56dff3afd2720bba668b4567",
                    "56dff421d2720b5f5a8b4567",
                    "56dff4a2d2720bbd668b456a",
                    "56dff4ecd2720b5f5a8b4568",

                    "59e6920f86f77411d82aa167", //556x45
                    "59e6927d86f77411da468256",
                    "54527a984bdc2d4e668b4567",
                    "54527ac44bdc2d36668b4567",
                    "59e68f6f86f7746c9f75e846",
                    "59e6906286f7746c9f75e847",
                    "59e690b686f7746c9f75e848",
                    "59e6918f86f7746c9f75e849",
                    "60194943740c5d77f6705eea",
                    "601949593ae8f707c4608daa",
                    "5c0d5ae286f7741e46554302",

                    "5fbe3ffdf8b6a877a729ea82", //300blackout
                    "5fd20ff893a8961fc660a954",
                    "619636be6db0f2477964e710",
                    "6196364158ef8c428c287d9f",
                    "6196365d58ef8c428c287da1",
                    "64b8725c4b75259c590fa899",

                    "59e0d99486f7744a32234762", //762x39
                    "59e4d3d286f774176a36250a",
                    "5656d7c34bdc2d9d198b4587",
                    "59e4cf5286f7741778269d8a",
                    "59e4d24686f7741776641ac7",
                    "601aa3d2b2bcb34913271e6d",
                    "64b7af5a8532cf95ee0a0dbd",
                    "64b7af434b75259c590fa893",
                    "64b7af734b75259c590fa895",

                    "5c0d688c86f77413ae3407b2", //9x39
                    "61962d879bb3d20b0946d385",
                    "57a0dfb82459774d3078b56c",
                    "57a0e5022459774d1673f889",
                    "5c0d668f86f7747ccb7f13b2",
                    "6576f96220d53a5b8f3e395e"
                ]
            },
            LocalePush: 
            {
              Name: "MCM4 5.7mm Receiver",
              ShortName: "MCM4 57",
              Description: "The MUR-1S modular upper receiver for AR-based weapons, manufactured by Vltor. Fitted with mounts for attaching additional equipment. Chambered in 5.7mm."
            },
            HandbookParent: HandbookIDs.ReceiversAndSlides,
            HandbookPrice: 43999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: "",
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.Murs,
            newID: "MCM4300",
            OverrideProperties: {
                ConflictingItems: [
                    "5c0d5e4486f77478390952fe", //545x39
                    "61962b617c6c7b169525f168",
                    "56dfef82d2720bbd668b4567",
                    "56dff026d2720bb8668b4567",
                    "56dff061d2720bb5668b4567",
                    "56dff0bed2720bb0668b4567",
                    "56dff216d2720bbd668b4568",
                    "56dff2ced2720bb4668b4567",
                    "56dff338d2720bbd668b4569",
                    "56dff3afd2720bba668b4567",
                    "56dff421d2720b5f5a8b4567",
                    "56dff4a2d2720bbd668b456a",
                    "56dff4ecd2720b5f5a8b4568",

                    "59e6920f86f77411d82aa167", //556x45
                    "59e6927d86f77411da468256",
                    "54527a984bdc2d4e668b4567",
                    "54527ac44bdc2d36668b4567",
                    "59e68f6f86f7746c9f75e846",
                    "59e6906286f7746c9f75e847",
                    "59e690b686f7746c9f75e848",
                    "59e6918f86f7746c9f75e849",
                    "60194943740c5d77f6705eea",
                    "601949593ae8f707c4608daa",
                    "5c0d5ae286f7741e46554302",

                    "59e0d99486f7744a32234762", //762x39
                    "59e4d3d286f774176a36250a",
                    "5656d7c34bdc2d9d198b4587",
                    "59e4cf5286f7741778269d8a",
                    "59e4d24686f7741776641ac7",
                    "601aa3d2b2bcb34913271e6d",
                    "64b7af5a8532cf95ee0a0dbd",
                    "64b7af434b75259c590fa893",
                    "64b7af734b75259c590fa895",

                    "5c0d688c86f77413ae3407b2", //9x39
                    "61962d879bb3d20b0946d385",
                    "57a0dfb82459774d3078b56c",
                    "57a0e5022459774d1673f889",
                    "5c0d668f86f7747ccb7f13b2",
                    "6576f96220d53a5b8f3e395e",

                    "5cc80f53e4a949000e1ea4f8", //57
                    "5cc86832d7f00c000d3a6e6c",
                    "5cc86840d7f00c002412c56c",
                    "5cc80f67e4a949035e43bbba",
                    "5cc80f38e4a949001152b560",
                    "5cc80f8fe4a949033b0224a2",
                    "5cc80f79e4a949033c7343b2"
                ]
            },
            LocalePush: 
            {
              Name: "MCM4 .300 Receiver",
              ShortName: "MCM4 300",
              Description: "The MUR-1S modular upper receiver for AR-based weapons, manufactured by Vltor. Fitted with mounts for attaching additional equipment. Chambered in .300 blackout."
            },
            HandbookParent: HandbookIDs.ReceiversAndSlides,
            HandbookPrice: 43999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: "",
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.Murs,
            newID: "MCM4545",
            OverrideProperties: {
                ConflictingItems: [
                    "59e6920f86f77411d82aa167", //556x45
                    "59e6927d86f77411da468256",
                    "54527a984bdc2d4e668b4567",
                    "54527ac44bdc2d36668b4567",
                    "59e68f6f86f7746c9f75e846",
                    "59e6906286f7746c9f75e847",
                    "59e690b686f7746c9f75e848",
                    "59e6918f86f7746c9f75e849",
                    "60194943740c5d77f6705eea",
                    "601949593ae8f707c4608daa",
                    "5c0d5ae286f7741e46554302",

                    "5fbe3ffdf8b6a877a729ea82", //300blackout
                    "5fd20ff893a8961fc660a954",
                    "619636be6db0f2477964e710",
                    "6196364158ef8c428c287d9f",
                    "6196365d58ef8c428c287da1",
                    "64b8725c4b75259c590fa899",

                    "59e0d99486f7744a32234762", //762x39
                    "59e4d3d286f774176a36250a",
                    "5656d7c34bdc2d9d198b4587",
                    "59e4cf5286f7741778269d8a",
                    "59e4d24686f7741776641ac7",
                    "601aa3d2b2bcb34913271e6d",
                    "64b7af5a8532cf95ee0a0dbd",
                    "64b7af434b75259c590fa893",
                    "64b7af734b75259c590fa895",

                    "5c0d688c86f77413ae3407b2", //9x39
                    "61962d879bb3d20b0946d385",
                    "57a0dfb82459774d3078b56c",
                    "57a0e5022459774d1673f889",
                    "5c0d668f86f7747ccb7f13b2",
                    "6576f96220d53a5b8f3e395e",

                    "5cc80f53e4a949000e1ea4f8", //57
                    "5cc86832d7f00c000d3a6e6c",
                    "5cc86840d7f00c002412c56c",
                    "5cc80f67e4a949035e43bbba",
                    "5cc80f38e4a949001152b560",
                    "5cc80f8fe4a949033b0224a2",
                    "5cc80f79e4a949033c7343b2"
                ]
            },
            LocalePush: 
            {
              Name: "MCM4 5.45x39mm Receiver",
              ShortName: "MCM4 545",
              Description: "The MUR-1S modular upper receiver for AR-based weapons, manufactured by Vltor. Fitted with mounts for attaching additional equipment. Chambered in 5.45x39mm."
            },
            HandbookParent: HandbookIDs.ReceiversAndSlides,
            HandbookPrice: 43999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: "",
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.Murs,
            newID: "MCM4762",
            OverrideProperties: {
                ConflictingItems: [
                    "5c0d5e4486f77478390952fe", //545x39
                    "61962b617c6c7b169525f168",
                    "56dfef82d2720bbd668b4567",
                    "56dff026d2720bb8668b4567",
                    "56dff061d2720bb5668b4567",
                    "56dff0bed2720bb0668b4567",
                    "56dff216d2720bbd668b4568",
                    "56dff2ced2720bb4668b4567",
                    "56dff338d2720bbd668b4569",
                    "56dff3afd2720bba668b4567",
                    "56dff421d2720b5f5a8b4567",
                    "56dff4a2d2720bbd668b456a",
                    "56dff4ecd2720b5f5a8b4568",

                    "59e6920f86f77411d82aa167", //556x45
                    "59e6927d86f77411da468256",
                    "54527a984bdc2d4e668b4567",
                    "54527ac44bdc2d36668b4567",
                    "59e68f6f86f7746c9f75e846",
                    "59e6906286f7746c9f75e847",
                    "59e690b686f7746c9f75e848",
                    "59e6918f86f7746c9f75e849",
                    "60194943740c5d77f6705eea",
                    "601949593ae8f707c4608daa",
                    "5c0d5ae286f7741e46554302",

                    "5fbe3ffdf8b6a877a729ea82", //300blackout
                    "5fd20ff893a8961fc660a954",
                    "619636be6db0f2477964e710",
                    "6196364158ef8c428c287d9f",
                    "6196365d58ef8c428c287da1",
                    "64b8725c4b75259c590fa899",

                    "5c0d688c86f77413ae3407b2", //9x39
                    "61962d879bb3d20b0946d385",
                    "57a0dfb82459774d3078b56c",
                    "57a0e5022459774d1673f889",
                    "5c0d668f86f7747ccb7f13b2",
                    "6576f96220d53a5b8f3e395e",

                    "5cc80f53e4a949000e1ea4f8", //57
                    "5cc86832d7f00c000d3a6e6c",
                    "5cc86840d7f00c002412c56c",
                    "5cc80f67e4a949035e43bbba",
                    "5cc80f38e4a949001152b560",
                    "5cc80f8fe4a949033b0224a2",
                    "5cc80f79e4a949033c7343b2"
                ]
            },
            LocalePush: 
            {
              Name: "MCM4 7.62x39mm Receiver",
              ShortName: "MCM4 762",
              Description: "The MUR-1S modular upper receiver for AR-based weapons, manufactured by Vltor. Fitted with mounts for attaching additional equipment. Chambered in 7.62x39mm."
            },
            HandbookParent: HandbookIDs.ReceiversAndSlides,
            HandbookPrice: 43999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: "",
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.Murs,
            newID: "MCM4939",
            OverrideProperties: {
                ConflictingItems: [
                    "5c0d5e4486f77478390952fe", //545x39
                    "61962b617c6c7b169525f168",
                    "56dfef82d2720bbd668b4567",
                    "56dff026d2720bb8668b4567",
                    "56dff061d2720bb5668b4567",
                    "56dff0bed2720bb0668b4567",
                    "56dff216d2720bbd668b4568",
                    "56dff2ced2720bb4668b4567",
                    "56dff338d2720bbd668b4569",
                    "56dff3afd2720bba668b4567",
                    "56dff421d2720b5f5a8b4567",
                    "56dff4a2d2720bbd668b456a",
                    "56dff4ecd2720b5f5a8b4568",

                    "59e6920f86f77411d82aa167", //556x45
                    "59e6927d86f77411da468256",
                    "54527a984bdc2d4e668b4567",
                    "54527ac44bdc2d36668b4567",
                    "59e68f6f86f7746c9f75e846",
                    "59e6906286f7746c9f75e847",
                    "59e690b686f7746c9f75e848",
                    "59e6918f86f7746c9f75e849",
                    "60194943740c5d77f6705eea",
                    "601949593ae8f707c4608daa",
                    "5c0d5ae286f7741e46554302",

                    "5fbe3ffdf8b6a877a729ea82", //300blackout
                    "5fd20ff893a8961fc660a954",
                    "619636be6db0f2477964e710",
                    "6196364158ef8c428c287d9f",
                    "6196365d58ef8c428c287da1",
                    "64b8725c4b75259c590fa899",

                    "59e0d99486f7744a32234762", //762x39
                    "59e4d3d286f774176a36250a",
                    "5656d7c34bdc2d9d198b4587",
                    "59e4cf5286f7741778269d8a",
                    "59e4d24686f7741776641ac7",
                    "601aa3d2b2bcb34913271e6d",
                    "64b7af5a8532cf95ee0a0dbd",
                    "64b7af434b75259c590fa893",
                    "64b7af734b75259c590fa895",

                    "5cc80f53e4a949000e1ea4f8", //57
                    "5cc86832d7f00c000d3a6e6c",
                    "5cc86840d7f00c002412c56c",
                    "5cc80f67e4a949035e43bbba",
                    "5cc80f38e4a949001152b560",
                    "5cc80f8fe4a949033b0224a2",
                    "5cc80f79e4a949033c7343b2"
                ]
            },
            LocalePush: 
            {
              Name: "MCM4 9x39mm Receiver",
              ShortName: "MCM4 939",
              Description: "The MUR-1S modular upper receiver for AR-based weapons, manufactured by Vltor. Fitted with mounts for attaching additional equipment. Chambered in 9x39mm."
            },
            HandbookParent: HandbookIDs.ReceiversAndSlides,
            HandbookPrice: 43999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: "",
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.Battlemag,
            newID: "MCM457Mag",
            OverrideProperties: {
              Cartridges: [
                  {
                    "_name": "cartridges",
                    "_id": hashUtil.generate(),
                    "_max_count": 32,
                    "_parent": "MCM457Mag",
                    "_props": 
                      {"filters": [
                        {
                          "Filter": [
                            "5cc80f53e4a949000e1ea4f8", //57
                            "5cc86832d7f00c000d3a6e6c",
                            "5cc86840d7f00c002412c56c",
                            "5cc80f67e4a949035e43bbba",
                            "5cc80f38e4a949001152b560",
                            "5cc80f8fe4a949033b0224a2",
                            "5cc80f79e4a949033c7343b2"
                        ]
                      }
                    ]
                  },
                  "_proto": "5748538b2459770af276a261"
                }
              ]
            },
            LocalePush: 
            {
              Name: "5.7mm Magpul PMAG 32-round magazine",
              ShortName: "MCM4 57Mag",
              Description: "A 32-round polymer Magpul PMAG magazine, for 5.7mm ammunition."
            },
            HandbookParent: HandbookIDs.Magazines,
            HandbookPrice: 7999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: "",
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.Battlemag,
            newID: "MCM4300Mag",
            OverrideProperties: {
              Cartridges: [
                  {
                    "_name": "cartridges",
                    "_id": hashUtil.generate(),
                    "_max_count": 32,
                    "_parent": "MCM4300Mag",
                    "_props": 
                      {"filters": [
                        {
                          "Filter": [
                            "5fbe3ffdf8b6a877a729ea82", //300blackout
                            "5fd20ff893a8961fc660a954",
                            "619636be6db0f2477964e710",
                            "6196364158ef8c428c287d9f",
                            "6196365d58ef8c428c287da1",
                            "64b8725c4b75259c590fa899"
                        ]
                      }
                    ]
                  },
                  "_proto": "5748538b2459770af276a261"
                }
              ]
            },
            LocalePush: 
            {
              Name: ".300 blackout Magpul PMAG 32-round magazine",
              ShortName: "MCM4 300Mag",
              Description: "A 32-round polymer Magpul PMAG magazine, for .300 blackout ammunition."
            },
            HandbookParent: HandbookIDs.Magazines,
            HandbookPrice: 7999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: "",
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.Battlemag,
            newID: "MCM4545Mag",
            OverrideProperties: {
              Cartridges: [
                  {
                    "_name": "cartridges",
                    "_id": hashUtil.generate(),
                    "_max_count": 32,
                    "_parent": "MCM4545Mag",
                    "_props": 
                      {"filters": [
                        {
                          "Filter": [
                            "5c0d5e4486f77478390952fe", //545x39
                            "61962b617c6c7b169525f168",
                            "56dfef82d2720bbd668b4567",
                            "56dff026d2720bb8668b4567",
                            "56dff061d2720bb5668b4567",
                            "56dff0bed2720bb0668b4567",
                            "56dff216d2720bbd668b4568",
                            "56dff2ced2720bb4668b4567",
                            "56dff338d2720bbd668b4569",
                            "56dff3afd2720bba668b4567",
                            "56dff421d2720b5f5a8b4567",
                            "56dff4a2d2720bbd668b456a",
                            "56dff4ecd2720b5f5a8b4568"
                        ]
                      }
                    ]
                  },
                  "_proto": "5748538b2459770af276a261"
                }
              ]
            },
            LocalePush: 
            {
              Name: "5.45x39mm Magpul PMAG 32-round magazine",
              ShortName: "MCM4 545Mag",
              Description: "A 32-round polymer Magpul PMAG magazine, for 5.45x39mm ammunition."
            },
            HandbookParent: HandbookIDs.Magazines,
            HandbookPrice: 7999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: "",
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.Battlemag,
            newID: "MCM4762Mag",
            OverrideProperties: {
              Cartridges: [
                  {
                    "_name": "cartridges",
                    "_id": hashUtil.generate(),
                    "_max_count": 32,
                    "_parent": "MCM4762Mag",
                    "_props": 
                      {"filters": [
                        {
                          "Filter": [
                            "59e0d99486f7744a32234762", //762x39
                            "59e4d3d286f774176a36250a",
                            "5656d7c34bdc2d9d198b4587",
                            "59e4cf5286f7741778269d8a",
                            "59e4d24686f7741776641ac7",
                            "601aa3d2b2bcb34913271e6d",
                            "64b7af5a8532cf95ee0a0dbd",
                            "64b7af434b75259c590fa893",
                            "64b7af734b75259c590fa895"
                        ]
                      }
                    ]
                  },
                  "_proto": "5748538b2459770af276a261"
                }
              ]
            },
            LocalePush: 
            {
              Name: "7.62x39mm Magpul PMAG 32-round magazine",
              ShortName: "MCM4 762Mag",
              Description: "A 32-round polymer Magpul PMAG magazine, for 7.62x39mm ammunition."
            },
            HandbookParent: HandbookIDs.Magazines,
            HandbookPrice: 7999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: "",
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.Battlemag,
            newID: "MCM4939Mag",
            OverrideProperties: {
              Cartridges: [
                  {
                    "_name": "cartridges",
                    "_id": hashUtil.generate(),
                    "_max_count": 32,
                    "_parent": "MCM4939Mag",
                    "_props": 
                      {"filters": [
                        {
                          "Filter": [
                            "5c0d688c86f77413ae3407b2", //9x39
                            "61962d879bb3d20b0946d385",
                            "57a0dfb82459774d3078b56c",
                            "57a0e5022459774d1673f889",
                            "5c0d668f86f7747ccb7f13b2",
                            "6576f96220d53a5b8f3e395e"
                        ]
                      }
                    ]
                  },
                  "_proto": "5748538b2459770af276a261"
                }
              ]
            },
            LocalePush: 
            {
              Name: "9x39mm Magpul PMAG 32-round magazine",
              ShortName: "MCM4 939Mag",
              Description: "A 32-round polymer Magpul PMAG magazine, for 9x39mm ammunition."
            },
            HandbookParent: HandbookIDs.Magazines,
            HandbookPrice: 7999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: "",
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        newItem.addToWeaponShelf("MCM4");      
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "MCM4", 5);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "MCM457", 3);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "MCM4300", 3);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "MCM4545", 3);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "MCM4762", 3);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "MCM4939", 3);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "MCM457Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "MCM4300Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "MCM4545Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "MCM4762Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "MCM4939Mag", 3);

        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "MCM4", 5);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "MCM457", 3);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "MCM4300", 3);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "MCM4545", 3);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "MCM4762", 3);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "MCM4939", 3);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "MCM457Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "MCM4300Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "MCM4545Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "MCM4762Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "MCM4939Mag", 3);

        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "MCM4", 5);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "MCM457", 3);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "MCM4300", 3);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "MCM4545", 3);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "MCM4762", 3);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "MCM4939", 3);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "MCM457Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "MCM4300Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "MCM4545Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "MCM4762Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "MCM4939Mag", 3);

        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "MCM4", 5);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "MCM457", 5);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "MCM4300", 3);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "MCM4545", 3);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "MCM4762", 3);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "MCM4939", 3);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "MCM457Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "MCM4300Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "MCM4545Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "MCM4762Mag", 3);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "MCM4939Mag", 3);

        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "MCM4", 5);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "MCM457", 3);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "MCM4300", 3);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "MCM4545", 3);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "MCM4762", 3);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "MCM4939", 3);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "MCM457Mag", 3);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "MCM4300Mag", 3);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "MCM4545Mag", 3);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "MCM4762Mag", 3);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "MCM4939Mag", 3);

        const scav = tables.bots.types["assault"];
        scav.inventory.Ammo["MultiCalibre"] =
        {
          "5c0d5e4486f77478390952fe": 1, //545x39
          "61962b617c6c7b169525f168": 1,
          "56dfef82d2720bbd668b4567": 1,
          "56dff026d2720bb8668b4567": 1,
          "56dff061d2720bb5668b4567": 1,
          "56dff0bed2720bb0668b4567": 1,
          "56dff216d2720bbd668b4568": 1,
          "56dff2ced2720bb4668b4567": 1,
          "56dff338d2720bbd668b4569": 1,
          "56dff3afd2720bba668b4567": 1,
          "56dff421d2720b5f5a8b4567": 1,
          "56dff4a2d2720bbd668b456a": 1,
          "56dff4ecd2720b5f5a8b4568": 1,
  
          "59e6920f86f77411d82aa167": 1, //556x54
          "59e6927d86f77411da468256": 1,
          "54527a984bdc2d4e668b4567": 1,
          "54527ac44bdc2d36668b4567": 1,
          "59e68f6f86f7746c9f75e846": 1,
          "59e6906286f7746c9f75e847": 1,
          "59e690b686f7746c9f75e848": 1,
          "59e6918f86f7746c9f75e849": 1,
          "60194943740c5d77f6705eea": 1,
          "601949593ae8f707c4608daa": 1,
          "5c0d5ae286f7741e46554302": 1,
  
          "5fbe3ffdf8b6a877a729ea82": 1, //300blackout
          "5fd20ff893a8961fc660a954": 1,
          "619636be6db0f2477964e710": 1,
          "6196364158ef8c428c287d9f": 1,
          "6196365d58ef8c428c287da1": 1,
          "64b8725c4b75259c590fa899": 1,
  
          "59e0d99486f7744a32234762": 1, //762x39
          "59e4d3d286f774176a36250a": 1,
          "5656d7c34bdc2d9d198b4587": 1,
          "59e4cf5286f7741778269d8a": 1,
          "59e4d24686f7741776641ac7": 1,
          "601aa3d2b2bcb34913271e6d": 1,
          "64b7af5a8532cf95ee0a0dbd": 1,
          "64b7af434b75259c590fa893": 1,
          "64b7af734b75259c590fa895": 1,
  
          "5c0d688c86f77413ae3407b2": 1, //9x39
          "61962d879bb3d20b0946d385": 1,
          "57a0dfb82459774d3078b56c": 1,
          "57a0e5022459774d1673f889": 1,
          "5c0d668f86f7747ccb7f13b2": 1,
          "6576f96220d53a5b8f3e395e": 1,
  
          "5cc80f53e4a949000e1ea4f8": 1, //57
          "5cc86832d7f00c000d3a6e6c": 1,
          "5cc86840d7f00c002412c56c": 1,
          "5cc80f67e4a949035e43bbba": 1,
          "5cc80f38e4a949001152b560": 1,
          "5cc80f8fe4a949033b0224a2": 1,
          "5cc80f79e4a949033c7343b2": 1
        }
      //#endregion
      //
      //
      //
      //#region STM46
      this.utils.createItem({
        newItem: {
            ItemToClone: ItemGenIDs.Stm,
            newID: "STM46",
            OverrideProperties: {
                Chambers: [
                    {
                      "_id": hashUtil.generate(),
                      "_mergeSlotWithChildren": false,
                      "_name": "patron_in_weapon",
                      "_parent": "STM46",
                      "_props": {
                        "filters": [
                        {
                            "Filter": [
                              "5ba26812d4351e003201fef1", //4.6x30
                              "5ba26835d4351e0035628ff5",
                              "5ba2678ad4351e44f824b344",
                              "5ba26844d4351e00334c9475",
                              "64b6979341772715af0f9c39"
                            ]
                          }
                        ]
                      },
                      "_proto": "55d4af244bdc2d962f8b4571",
                      "_required": false
                    }
                ],
                ConflictingItems: [
                    "5efb0da7a29a85116f6ea05f",
                    "5c3df7d588a4501f290594e5",
                    "58864a4f2459770fcc257101",
                    "56d59d3ad2720bdb418b4577",
                    "5c925fa22e221601da359b7b",
                    "5a3c16fe86f77452b62de32a",
                    "5efb0e16aeb21837e749c7ff",
                    "5c0d56a986f774449d5de529",
                    "64b7bbb74b75259c590fa897"
                ],
                Slots: [
                    {
                    "_id": "60339954d62c9b14ed777c08",
                    "_mergeSlotWithChildren": false,
                    "_name": "mod_pistol_grip",
                    "_parent": "STM46",
                    "_props": {
                        "filters": [
                        {
                            "Filter": [
                            "5c0e2ff6d174af02a1659d4a",
                            "5a33e75ac4a2826c6e06d759",
                            "55d4b9964bdc2d1d4e8b456e",
                            "571659bb2459771fb2755a12",
                            "602e71bd53a60014f9705bfa",
                            "6113c3586c780c1e710c90bc",
                            "6113cc78d3a39d50044c065a",
                            "6113cce3d92c473c770200c7",
                            "5cc9bcaed7f00c011c04e179",
                            "5bb20e18d4351e00320205d5",
                            "5bb20e0ed4351e3bac1212dc",
                            "6193dcd0f8ee7e52e4210a28",
                            "5d025cc1d7ad1a53845279ef",
                            "5c6d7b3d2e221600114c9b7d",
                            "57c55efc2459772d2c6271e7",
                            "57af48872459771f0b2ebf11",
                            "57c55f092459772d291a8463",
                            "57c55f112459772d28133310",
                            "57c55f172459772d27602381",
                            "5a339805c4a2826c6e06d73d",
                            "55802f5d4bdc2dac148b458f",
                            "5d15cf3bd7ad1a67e71518b2",
                            "59db3a1d86f77429e05b4e92",
                            "5fbcbd6c187fea44d52eda14",
                            "59db3acc86f7742a2c4ab912",
                            "59db3b0886f77429d72fb895",
                            "615d8faecabb9b7ad90f4d5d",
                            "5b07db875acfc40dc528a5f6",
                            "63f5feead259b42f0b4d6d0f",
                            "652911675ae2ae97b80fdf3c"
                            ],
                            "Shift": 0
                            }
                        ]
                    },
                    "_proto": "55d30c4c4bdc2db4468b457e",
                    "_required": true
                    },                    
                    {
                      "_id": hashUtil.generate(),
                      "_mergeSlotWithChildren": false,
                      "_name": "mod_magazine",
                      "_parent": "STM46",
                      "_props": {
                        "filters": [
                          {
                            "AnimationIndex": -1,
                            "Filter": [
                              "STM46Mag",
                              "STM46Drum"
                            ]
                          }
                        ]
                      },
                      "_proto": "55d30c394bdc2dae468b4577",
                      "_required": false
                    },
                    {
                      "_id": hashUtil.generate(),
                      "_mergeSlotWithChildren": false,
                      "_name": "mod_reciever",
                      "_parent": "STM46",
                      "_props": {
                        "filters": [
                          {
                            "Filter": [
                              "STM46Rec"
                            ],
                            "Shift": 0
                          }
                        ]
                      },
                      "_proto": "55d30c4c4bdc2db4468b457e",
                      "_required": true
                    },
                    {
                      "_id": "60339954d62c9b14ed777c0b",
                      "_mergeSlotWithChildren": false,
                      "_name": "mod_stock_001",
                      "_parent": "STM46",
                      "_props": {
                        "filters": [
                          {
                            "Filter": [
                              "5a33ca0fc4a282000d72292f",
                              "5c0faeddd174af02a962601f",
                              "5649be884bdc2d79388b4577",
                              "5d120a10d7ad1a4e1026ba85",
                              "5b0800175acfc400153aebd4",
                              "5947e98b86f774778f1448bc",
                              "5947eab886f77475961d96c5",
                              "602e3f1254072b51b239f713",
                              "5c793fb92e221644f31bfb64",
                              "5c793fc42e221600114ca25d",
                              "591aef7986f774139d495f03",
                              "591af10186f774139d495f0e",
                              "627254cc9c563e6e442c398f",
                              "638de3603a1a4031d8260b8c"
                            ],
                            "Shift": 0
                          }
                        ]
                      },
                      "_proto": "55d30c4c4bdc2db4468b457e",
                      "_required": true
                    },
                    {
                      "_id": "60339954d62c9b14ed777c0c",
                      "_mergeSlotWithChildren": false,
                      "_name": "mod_charge",
                      "_parent": "STM46",
                      "_props": {
                        "filters": [
                          {
                            "Filter": [
                              "5c0faf68d174af02a96260b8",
                              "56ea7165d2720b6e518b4583",
                              "55d44fd14bdc2d962f8b456e",
                              "5ea16d4d5aad6446a939753d",
                              "5bb20dbcd4351e44f824c04e",
                              "6033749e88382f4fab3fd2c5",
                              "5b2240bf5acfc40dc528af69",
                              "5d44334ba4b9362b346d1948",
                              "5f633ff5c444ce7e3c30a006",
                              "651bf5617b3b552ef6712cb7"
                            ],
                            "Shift": 0
                          }
                        ]
                      },
                      "_proto": "55d30c4c4bdc2db4468b457e",
                      "_required": true
                    },
                    {
                      "_id": "6033d3b2af437007501f2b03",
                      "_mergeSlotWithChildren": false,
                      "_name": "mod_tactical_000",
                      "_parent": "STM46",
                      "_props": {
                        "filters": [
                          {
                            "Filter": [
                              "602f85fd9b513876d4338d9c",
                              "60338ff388382f4fab3fd2c8"
                            ],
                            "Shift": 0
                          }
                        ]
                      },
                      "_proto": "55d30c4c4bdc2db4468b457e",
                      "_required": false
                    }
                ],
                ammoCaliber: "Caliber46x30",
                defAmmo: "5ba2678ad4351e44f824b344",
                defMagType: "STM46Mag",
                weapFireType: [
                    "single",
                    "fullauto"
                ]
            },
            LocalePush: {
              Name: "Soyuz-TM STM-46 Gen.2 4.6x30 carbine",
              ShortName: "STM 4.6x30",
              Description: "A PCC carbine with excellent performance already \"out of the box\", manufactured by Soyuz-TM Arms. Designed with the participation of world bronze medalist in Semi-Auto Rifle Vadim Mikhailov. Accuracy, speed, comfort of recoil. Compatible with custom 4.6x30mm magazines."
            },
            HandbookParent: HandbookIDs.AssaultCarbines,
            HandbookPrice: 47999,
            PushMastery: true,
            AddToBots: false,
            BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.GMag,
            newID: "STM46Mag",
            OverrideProperties: {
              Cartridges: [
                  {
                    "_name": "cartridges",
                    "_id": hashUtil.generate(),
                    "_max_count": 33,
                    "_parent": "STM46Mag",
                    "_props": 
                      {"filters": [
                        {
                          "Filter": [
                            "5ba26812d4351e003201fef1",
                            "5ba26835d4351e0035628ff5",
                            "5ba2678ad4351e44f824b344",
                            "5ba26844d4351e00334c9475",
                            "64b6979341772715af0f9c39"
                        ]
                      }
                    ]
                  },
                  "_proto": "5748538b2459770af276a261"
                }
              ]
            },
            LocalePush: {
              Name: "Glock 4.6x30 \"Big Stick\" 33-round magazine",
              ShortName: "STM46 Mag",
              Description: "A factory-produced 33-round 4.6x30 magazine for the custom Soyuz-TM STM-46 Gen.2 4.6x30mm carbine."
            },
            HandbookParent: HandbookIDs.Magazines,
            HandbookPrice: 8999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.GDrum,
            newID: "STM46Drum",
            OverrideProperties: {
              Cartridges: [
                  {
                    "_name": "cartridges",
                    "_id": hashUtil.generate(),
                    "_max_count": 50,
                    "_parent": "STM46Mag",
                    "_props": 
                      {"filters": [
                        {
                          "Filter": [
                            "5ba26812d4351e003201fef1",
                            "5ba26835d4351e0035628ff5",
                            "5ba2678ad4351e44f824b344",
                            "5ba26844d4351e00334c9475",
                            "64b6979341772715af0f9c39"
                        ]
                      }
                    ]
                  },
                  "_proto": "5748538b2459770af276a261"
                }
              ]
            },
            LocalePush: {
              Name: "Custom Glock 4.6x30 SGM Tactical 50-round drum magazine",
              ShortName: "STM46 Drum",
              Description: "A high-capacity 50-round magazine for the custom Soyuz-TM STM-46 Gen.2 4.6x30mm carbine. Made in Korea and imported by SGM Tactical. Can hold even more than 50 rounds, but the manufacturer does not recommend loading more."
            },
            HandbookParent: HandbookIDs.Magazines,
            HandbookPrice: 18499,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        this.utils.createItem({
          newItem: {
            ItemToClone: ItemGenIDs.StmRec,
            newID: "STM46Rec",
            OverrideProperties: {
                ConflictingItems: [
                    "5efb0da7a29a85116f6ea05f", //9x19
                    "5c3df7d588a4501f290594e5",
                    "58864a4f2459770fcc257101",
                    "56d59d3ad2720bdb418b4577",
                    "5c925fa22e221601da359b7b",
                    "5a3c16fe86f77452b62de32a",
                    "5efb0e16aeb21837e749c7ff",
                    "5c0d56a986f774449d5de529",
                    "64b7bbb74b75259c590fa897"
                ]
            },
            LocalePush: {
              Name: "STM-46 4.6x30 upper receiver",
              ShortName: "STM46 Rec",
              Description: "An upper receiver for the STM-46 Gen.2 4.6x30 carbine. Equipped with a mount for attaching additional tactical devices."
            },
            HandbookParent: HandbookIDs.ReceiversAndSlides,
            HandbookPrice: 31999,
            PushMastery: false,
            AddToBots: false,
            BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
            QuestPush: 
            {
              AddToQuests: false,
              QuestConditionType: "",
              QuestTargetConditionToClone: ""
            },
            LootPush: 
            {
              AddToStaticLoot: false,
              LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
              StaticLootProbability: 5
            },
            AddToCases: false,
            CasesToPush: [
              AllItemList.CONTAINER_DOCS,
              AllItemList.CONTAINER_SICC
            ],
            PushToFleaBlacklist: false,
            SlotInfo: {
              AddToSlot: false,
              Slot: 0
            }
          }
        }, tables, ragfair, jsonUtil);

        newItem.addToWeaponShelf("STM46");
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "STM46", 5);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "STM46Mag", 10);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "STM46Drum", 3);
        this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "STM46Rec", 3);

        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "STM46", 5);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "STM46Mag", 10);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "STM46Drum", 3);
        this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "STM46Rec", 3);

        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "STM46", 5);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "STM46Mag", 10);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "STM46Drum", 3);
        this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "STM46Rec", 3);

        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "STM46", 5);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "STM46Mag", 10);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "STM46Drum", 3);
        this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "STM46Rec", 3);

        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "STM46", 5);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "STM46Mag", 10);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "STM46Drum", 3);
        this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "STM46Rec", 3);
        //#endregion
      //
      //
      //
      //#region Judge
      this.utils.createItem({
        newItem: {
        ItemToClone: ItemGenIDs.Glock,
        newID: "Judge",
        OverrideProperties: {
          Chambers: [
            {
              "_name": "patron_in_weapon",
              "_id": hashUtil.generate(),
              "_parent": "Judge",
              "_props": {
                "filters": [
                  {
                    "Filter": [
                      "5e81f423763d9f754677bf2e",
                      "5efb0cabfb3e451d70735af5",
                      "5efb0fc6aeb21837e749c801",
                      "5efb0d4f4bc50b58e81710f3",
                      "5ea2a8e200685063ec28c05a"
                    ]
                  }
                ]
              },
              "_required": false,
              "_mergeSlotWithChildren": false,
              "_proto": "55d4af244bdc2d962f8b4571"
            }
          ],
          Slots: [
            {
              "_name": "mod_barrel",
              "_id": hashUtil.generate(),
              "_parent": "Judge",
              "_props": {
                "filters": [
                  {
                    "Shift": 0,
                    "Filter": [
                      "5a6b5b8a8dc32e001207faf3",
                      "5a6b5e468dc32e001207faf5",
                      "5a6b60158dc32e000a31138b",
                      "5a6b5f868dc32e000a311389",
                      "5a6b5ed88dc32e000c52ec86"
                    ]
                  }
                ]
              },
              "_required": true,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c4c4bdc2db4468b457e"
            },
            {
              "_name": "mod_pistol_grip",
              "_id": hashUtil.generate(),
              "_parent": "Judge",
              "_props": {
                "filters": [
                  {
                    "Shift": 0,
                    "Filter": [
                      "5a7b4960e899ef197b331a2d"
                    ]
                  }
                ]
              },
              "_required": false,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c4c4bdc2db4468b457e"
            },
            {
              "_name": "mod_reciever",
              "_id": hashUtil.generate(),
              "_parent": "Judge",
              "_props": {
                "filters": [
                  {
                    "Shift": 0,
                    "Filter": [
                      "JudgeReceiver"
                    ]
                  }
                ]
              },
              "_required": true,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c4c4bdc2db4468b457e"
            },
            {
              "_name": "mod_magazine",
              "_id": hashUtil.generate(),
              "_parent": "Judge",
              "_props": {
                "filters": [
                  {
                    "AnimationIndex": 0,
                    "Filter": [
                      "JudgeMag",
                      "JudgeExtMag",
                      "JudgeDrum"
                    ]
                  }
                ]
              },
              "_required": false,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c394bdc2dae468b4577"
            },
            {
              "_name": "mod_tactical",
              "_id": hashUtil.generate(),
              "_parent": "Judge",
              "_props": {
                "filters": [
                  {
                    "Shift": 0,
                    "Filter": [
                      "5a7ad74e51dfba0015068f45",
                      "5a800961159bd4315e3a1657",
                      "5cc9c20cd7f00c001336c65d",
                      "5d2369418abbc306c62e0c80",
                      "5b07dd285acfc4001754240d",
                      "56def37dd2720bec348b456a",
                      "5a7b483fe899ef0016170d15",
                      "5a5f1ce64f39f90b401987bc",
                      "560d657b4bdc2da74d8b4572",
                      "5a7ad4af51dfba0013379717",
                      "5a7b4900e899ef197b331a2a",
                      "6272370ee4013c5d7e31f418",
                      "6272379924e29f06af4d5ecb"
                    ]
                  }
                ]
              },
              "_required": false,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c4c4bdc2db4468b457e"
            },
            {
              "_name": "mod_mount",
              "_id": hashUtil.generate(),
              "_parent": "Judge",
              "_props": {
                "filters": [
                  {
                    "Shift": 0,
                    "Filter": [
                      "5a7ad55551dfba0015068f42"
                    ]
                  }
                ]
              },
              "_required": false,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c4c4bdc2db4468b457e"
            },
            {
              "_name": "mod_stock",
              "_id": hashUtil.generate(),
              "_parent": "Judge",
              "_props": {
                "filters": [
                  {
                    "Shift": 0,
                    "Filter": [
                      "5d1c702ad7ad1a632267f429"
                    ]
                  }
                ]
              },
              "_required": false,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c4c4bdc2db4468b457e"
            }
          ],
          ammoCaliber: "Caliber1143x23ACP",
          defAmmo: "5efb0cabfb3e451d70735af5",
          defMagType: "JudgeMag",
          weapFireType :[
            "single",
            "fullauto"
          ]
        },
        LocalePush: {
          Name: "The Judge",
          ShortName: "Judge",
          Description: "The Judge is a handgun capable of loading 12 gauge shotgun shells. Many scavs quiver in fear when they hear the name."
        },
        HandbookParent: HandbookIDs.Pistols,
        HandbookPrice: 55999,
        PushMastery: true,
        AddToBots: false,
        BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
        QuestPush: 
        {
          AddToQuests: false,
          QuestConditionType: "",
          QuestTargetConditionToClone: ""
        },
        LootPush: 
        {
          AddToStaticLoot: false,
          LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
          StaticLootProbability: 5
        },
        AddToCases: false,
        CasesToPush: [
          AllItemList.CONTAINER_DOCS,
          AllItemList.CONTAINER_SICC
        ],
        PushToFleaBlacklist: true,
        SlotInfo: {
          AddToSlot: false,
          Slot: 0
        }
      }
    }, tables, ragfair, jsonUtil);


    this.utils.createItem({
      newItem: {
      ItemToClone: ItemGenIDs.GlockRec,
      newID: "JudgeReceiver",
      OverrideProperties: {
          ConflictingItems: [
              "5efb0da7a29a85116f6ea05f", //9x19
              "5c3df7d588a4501f290594e5",
              "58864a4f2459770fcc257101",
              "56d59d3ad2720bdb418b4577",
              "5c925fa22e221601da359b7b",
              "5a3c16fe86f77452b62de32a",
              "5efb0e16aeb21837e749c7ff",
              "5c0d56a986f774449d5de529",
              "64b7bbb74b75259c590fa897"
            ]
        },
        LocalePush: {
            Name: "Judge custom Lone Wolf Slide",
            ShortName: "Judge Lone Wolf",
            Description: "A custom Lone Wolf receiver modified to fit on the Judge handgun. The sound of the slide brings nightmares to many."
          },
          HandbookParent: HandbookIDs.ReceiversAndSlides,
          HandbookPrice: 41999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.CONTAINER_DOCS,
            AllItemList.CONTAINER_SICC
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
        ItemToClone: ItemGenIDs.GlockMag,
        newID: "JudgeMag",
        OverrideProperties: {
          Cartridges: [
              {
                "_name": "cartridges",
                "_id": hashUtil.generate(),
                "_max_count": 17,
                "_parent": "JudgeMag",
                "_props": 
                  {"filters": [
                    {
                      "Filter": [
                        "5e81f423763d9f754677bf2e",
                        "5efb0cabfb3e451d70735af5",
                        "5efb0fc6aeb21837e749c801",
                        "5efb0d4f4bc50b58e81710f3",
                        "5ea2a8e200685063ec28c05a"
                    ]
                  }
                ]
              },
              "_proto": "5748538b2459770af276a261"
            }
          ]
        },
          LocalePush: {
            Name: "Judge 17 Round Magazine",
            ShortName: "Judge 17 Mag",
            Description: "A 17-round magazine made for the Judge handgun, the sound of which causes scavs to quiver in fear."
          },
          HandbookParent: HandbookIDs.Magazines,
          HandbookPrice: 11999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.CONTAINER_DOCS,
            AllItemList.CONTAINER_SICC
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
        ItemToClone: ItemGenIDs.GMag,
        newID: "JudgeExtMag",
        OverrideProperties: {
          Cartridges: [
              {
                "_name": "cartridges",
                "_id": hashUtil.generate(),
                "_max_count": 33,
                "_parent": "JudgeExtMag",
                "_props": 
                  {"filters": [
                    {
                      "Filter": [
                        "5e81f423763d9f754677bf2e",
                        "5efb0cabfb3e451d70735af5",
                        "5efb0fc6aeb21837e749c801",
                        "5efb0d4f4bc50b58e81710f3",
                        "5ea2a8e200685063ec28c05a"
                    ]
                  }
                ]
              },
              "_proto": "5748538b2459770af276a261"
            }
          ]
        },
          LocalePush: {
            Name: "Judge 33 Round Magazine",
            ShortName: "Judge 33 Mag",
            Description: "A 33-round magazine made for the Judge handgun, the sound of which causes scavs to quiver in fear."
          },
          HandbookParent: HandbookIDs.Magazines,
          HandbookPrice: 15499,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.CONTAINER_DOCS,
            AllItemList.CONTAINER_SICC
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
        ItemToClone: ItemGenIDs.GDrum,
        newID: "JudgeDrum",
        OverrideProperties: {
          Cartridges: [
              {
                "_name": "cartridges",
                "_id": hashUtil.generate(),
                "_max_count": 50,
                "_parent": "JudgeDrum",
                "_props": 
                  {"filters": [
                    {
                      "Filter": [
                        "5e81f423763d9f754677bf2e",
                        "5efb0cabfb3e451d70735af5",
                        "5efb0fc6aeb21837e749c801",
                        "5efb0d4f4bc50b58e81710f3",
                        "5ea2a8e200685063ec28c05a"
                    ]
                  }
                ]
              },
              "_proto": "5748538b2459770af276a261"
            }
          ]
        },
          LocalePush: {
            Name: "Judge Drum Magazine",
            ShortName: "Judge Drum",
            Description: "A 50-round Drum magazine made for the Judge handgun, the sound of which causes scavs to quiver in fear."
          },
          HandbookParent: HandbookIDs.Magazines,
          HandbookPrice: 25999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.CONTAINER_DOCS,
            AllItemList.CONTAINER_SICC
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      newItem.addToWeaponShelf("Judge");
      this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "Judge", 2);
      this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "Judge", 2);
      this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "Judge", 2);
      this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "Judge", 2);
      this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "Judge", 2);
      //#endregion
      //
      //
      //
      //#region Jury
      this.utils.createItem({
        newItem: {
        ItemToClone: ItemGenIDs.Spear,
        newID: "Jury",
        OverrideProperties: {
          Chambers: [
            {
              "_name": "patron_in_weapon",
              "_id": hashUtil.generate(),
              "_parent": "Jury",
              "_props": {
                "filters": [
                  {
                    "Filter": [
                      "5cadf6ddae9215051e1c23b2",
                      "5cadf6e5ae921500113bb973",
                      "5cadf6eeae921500134b2799"
                    ]
                  }
                ]
              },
              "_required": false,
              "_mergeSlotWithChildren": false,
              "_proto": "55d4af244bdc2d962f8b4571"
            }
          ],
          Slots: [
            {
              "_name": "mod_pistol_grip",
              "_id": hashUtil.generate(),
              "_parent": "Jury",
              "_props": {
                "filters": [
                  {
                    "Shift": 0,
                    "Filter": [
                      "55d4b9964bdc2d1d4e8b456e",
                      "571659bb2459771fb2755a12",
                      "602e71bd53a60014f9705bfa",
                      "6113c3586c780c1e710c90bc",
                      "6113cc78d3a39d50044c065a",
                      "6113cce3d92c473c770200c7",
                      "5cc9bcaed7f00c011c04e179",
                      "5bb20e18d4351e00320205d5",
                      "5bb20e0ed4351e3bac1212dc",
                      "6193dcd0f8ee7e52e4210a28",
                      "5d025cc1d7ad1a53845279ef",
                      "5c6d7b3d2e221600114c9b7d",
                      "57c55efc2459772d2c6271e7",
                      "57af48872459771f0b2ebf11",
                      "57c55f092459772d291a8463",
                      "57c55f112459772d28133310",
                      "57c55f172459772d27602381",
                      "5a339805c4a2826c6e06d73d",
                      "55802f5d4bdc2dac148b458f",
                      "5d15cf3bd7ad1a67e71518b2",
                      "59db3a1d86f77429e05b4e92",
                      "5fbcbd6c187fea44d52eda14",
                      "59db3acc86f7742a2c4ab912",
                      "59db3b0886f77429d72fb895",
                      "615d8faecabb9b7ad90f4d5d",
                      "5b07db875acfc40dc528a5f6",
                      "63f5feead259b42f0b4d6d0f",
                      "652911675ae2ae97b80fdf3c"
                    ]
                  }
                ]
              },
              "_required": true,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c4c4bdc2db4468b457e"
            },
            {
              "_name": "mod_magazine",
              "_id": hashUtil.generate(),
              "_parent": "Jury",
              "_props": {
                "filters": [
                  {
                    "AnimationIndex": -1,
                    "Filter": [
                      "JuryMag",
                      "JuryExtMag",
                      "JuryDrum"
                    ]
                  }
                ]
              },
              "_required": false,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c394bdc2dae468b4577"
            },
            {
              "_name": "mod_reciever",
              "_id": hashUtil.generate(),
              "_parent": "Jury",
              "_props": {
                "filters": [
                  {
                    "Shift": 0,
                    "Filter": [
                      "JuryReceiver"
                    ]
                  }
                ]
              },
              "_required": true,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c4c4bdc2db4468b457e"
            },
            {
              "_name": "mod_stock_000",
              "_id": hashUtil.generate(),
              "_parent": "Jury",
              "_props": {
                "filters": [
                  {
                    "Shift": 0,
                    "Filter": [
                      "58ac1bf086f77420ed183f9f",
                      "5894a13e86f7742405482982",
                      "5fbcc429900b1d5091531dd7",
                      "5fbcc437d724d907e2077d5c",
                      "5c5db6ee2e221600113fba54",
                      "5c5db6f82e2216003a0fe914",
                      "6529348224cbe3c74a05e5c4"
                    ]
                  }
                ]
              },
              "_required": false,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c4c4bdc2db4468b457e"
            },
            {
              "_name": "mod_charge",
              "_id": hashUtil.generate(),
              "_parent": "Jury",
              "_props": {
                "filters": [
                  {
                    "Shift": 0,
                    "Filter": [
                      "6529109524cbe3c74a05e5b7"
                    ]
                  }
                ]
              },
              "_required": true,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c4c4bdc2db4468b457e"
            }
          ],
          ammoCaliber: "Caliber127x55",
          defAmmo: "5cadf6ddae9215051e1c23b2",
          defMagType: "JuryMag"
        },
        LocalePush: {
          Name: "The Jury",
          ShortName: "Jury",
          Description: "The Overseer of judgement. Or at least that's what it appears to be, considering the amount of scavs and PMC's brought down by it."
        },
        HandbookParent: HandbookIDs.MarksmanRifles,
        HandbookPrice: 60999,
        PushMastery: true,
        AddToBots: false,
        BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
        QuestPush: 
        {
          AddToQuests: false,
          QuestConditionType: "",
          QuestTargetConditionToClone: ""
        },
        LootPush: 
        {
          AddToStaticLoot: false,
          LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
          StaticLootProbability: 5
        },
        AddToCases: false,
        CasesToPush: [
          AllItemList.CONTAINER_DOCS,
          AllItemList.CONTAINER_SICC
        ],
        PushToFleaBlacklist: true,
        SlotInfo: {
          AddToSlot: false,
          Slot: 0
        }
      }
    }, tables, ragfair, jsonUtil);

    this.utils.createItem({
      newItem: {
        ItemToClone: ItemGenIDs.SpearMag,
        newID: "JuryMag",
        OverrideProperties: {
          Cartridges: [
              {
                "_name": "cartridges",
                "_id": hashUtil.generate(),
                "_max_count": 20,
                "_parent": "JuryMag",
                "_props": 
                  {"filters": [
                    {
                      "Filter": [
                        "5cadf6ddae9215051e1c23b2",
                        "5cadf6e5ae921500113bb973",
                        "5cadf6eeae921500134b2799"
                    ]
                  }
                ]
              },
              "_proto": "5748538b2459770af276a261"
            }
          ]
        },
        LocalePush: {
          Name: "Jury Magazine",
          ShortName: "Jury Mag",
          Description: "A 20 round extended magazine for the Jury marksman rifle. Nobody knows who produced these or where they come from."
        },
        HandbookParent: HandbookIDs.Magazines,
        HandbookPrice: 6999,
        PushMastery: false,
        AddToBots: false,
        BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
        QuestPush: 
        {
          AddToQuests: false,
          QuestConditionType: "",
          QuestTargetConditionToClone: ""
        },
        LootPush: 
        {
          AddToStaticLoot: false,
          LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
          StaticLootProbability: 5
        },
        AddToCases: false,
        CasesToPush: [
          AllItemList.CONTAINER_DOCS,
          AllItemList.CONTAINER_SICC
        ],
        PushToFleaBlacklist: false,
        SlotInfo: {
          AddToSlot: false,
          Slot: 0
        }
      }
    }, tables, ragfair, jsonUtil);
      

    this.utils.createItem({
      newItem: {
        ItemToClone: ItemGenIDs.SpearExtMag,
        newID: "JuryExtMag",
        OverrideProperties: {
          Cartridges: [
              {
                "_name": "cartridges",
                "_id": hashUtil.generate(),
                "_max_count": 25,
                "_parent": "JuryExtMag",
                "_props": 
                  {"filters": [
                    {
                      "Filter": [
                        "5cadf6ddae9215051e1c23b2",
                        "5cadf6e5ae921500113bb973",
                        "5cadf6eeae921500134b2799"
                    ]
                  }
                ]
              },
              "_proto": "5748538b2459770af276a261"
            }
          ]
        },
        LocalePush: {
          Name: "Jury Extended Magazine",
          ShortName: "Jury ExtMag",
          Description: "A 25 round extended magazine for the Jury marksman rifle. Nobody knows who produced these or where they come from."
        },
        HandbookParent: HandbookIDs.Magazines,
        HandbookPrice: 14999,
        PushMastery: false,
        AddToBots: false,
        BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
        QuestPush: 
        {
          AddToQuests: false,
          QuestConditionType: "",
          QuestTargetConditionToClone: ""
        },
        LootPush: 
        {
          AddToStaticLoot: false,
          LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
          StaticLootProbability: 5
        },
        AddToCases: false,
        CasesToPush: [
          AllItemList.CONTAINER_DOCS,
          AllItemList.CONTAINER_SICC
        ],
        PushToFleaBlacklist: false,
        SlotInfo: {
          AddToSlot: false,
          Slot: 0
        }
      }
    }, tables, ragfair, jsonUtil);

    this.utils.createItem({
      newItem: {
      ItemToClone: ItemGenIDs.XProducts50,
      newID: "JuryDrum",
      OverrideProperties: {
        Cartridges: [
            {
              "_name": "cartridges",
              "_id": hashUtil.generate(),
              "_max_count": 50,
              "_parent": "JuryDrum",
              "_props": 
                {"filters": [
                  {
                    "Filter": [
                      "5cadf6ddae9215051e1c23b2",
                      "5cadf6e5ae921500113bb973",
                      "5cadf6eeae921500134b2799"
                  ]
                }
              ]
            },
            "_proto": "5748538b2459770af276a261"
          }
        ]
      },
        LocalePush: {
          Name: "Jury Drum Magazine",
          ShortName: "Jury Drum",
          Description: "A 50 round drum magazine for the Jury marksman rifle. Nobody knows who produced these or where they come from."
        },
        HandbookParent: HandbookIDs.Magazines,
        HandbookPrice: 29999,
        PushMastery: false,
        AddToBots: false,
        BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
        QuestPush: 
        {
          AddToQuests: false,
          QuestConditionType: "",
          QuestTargetConditionToClone: ""
        },
        LootPush: 
        {
          AddToStaticLoot: false,
          LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
          StaticLootProbability: 5
        },
        AddToCases: false,
        CasesToPush: [
          AllItemList.CONTAINER_DOCS,
          AllItemList.CONTAINER_SICC
        ],
        PushToFleaBlacklist: false,
        SlotInfo: {
          AddToSlot: false,
          Slot: 0
        }
      }
    }, tables, ragfair, jsonUtil);

    this.utils.createItem({
      newItem: {
        ItemToClone: ItemGenIDs.SpearRec,
        newID: "JuryReceiver",
        OverrideProperties: {
            ConflictingItems: [
              "6529243824cbe3c74a05e5c1", //6.8x51
              "6529302b8c26af6326029fb7"
            ]
          },
          LocalePush: {
            Name: "Jury 12.7x55mm upper receiver",
            ShortName: "Jury Rec",
            Description: "An upper receiver for the Jury 12.7x55mm marksman rifle. Although its origin is a mystery, it is very effective at what it does."
          },
          HandbookParent: HandbookIDs.ReceiversAndSlides,
          HandbookPrice: 39999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.CONTAINER_DOCS,
            AllItemList.CONTAINER_SICC
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      newItem.addToWeaponShelf("Jury");
      this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "Jury", 2);
      this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "Jury", 2);
      this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "Jury", 2);
      this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "Jury", 2);
      this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "Jury", 2);
      //#endregion
      //
      //
      //
      //#region Executioner
      this.utils.createItem({
        newItem: {
        ItemToClone: ItemGenIDs.M700,
        newID: "Executioner",
        OverrideProperties: {
          Chambers: [
            {
              "_name": "patron_in_weapon",
              "_id": hashUtil.generate(),
              "_parent": "Executioner",
              "_props": {
                "filters": [
                  {
                    "Filter": [
                      "5fc382a9d724d907e2077dab",
                      "5fc275cf85fd526b824a571a",
                      "5fc382c1016cce60e8341b20",
                      "5fc382b6d6fa9c00c571bbc3"
                    ]
                  }
                ]
              },
              "_required": false,
              "_mergeSlotWithChildren": false,
              "_proto": "55d4af244bdc2d962f8b4571"
            }
          ],
          Slots: [
            {
              "_name": "mod_magazine",
              "_id": hashUtil.generate(),
              "_parent": "Executioner",
              "_props": {
                "filters": [
                  {
                    "AnimationIndex": 0,
                    "Filter": [
                      "ExecutionerOutdoorMag",
                      "ExecutionerMagAICS",
                      "ExecutionerMagPmag"
                    ]
                  }
                ]
              },
              "_required": false,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c394bdc2dae468b4577"
            },
            {
              "_name": "mod_stock",
              "_id": hashUtil.generate(),
              "_parent": "Executioner",
              "_props": {
                "filters": [
                  {
                    "Shift": 0,
                    "Filter": [
                      "5cde739cd7f00c0010373bd3",
                      "5d25d0ac8abbc3054f3e61f7",
                      "5bfeb32b0db834001a6694d9",
                      "5cdeac22d7f00c000f26168f",
                      "5cf13123d7f00c1085616a50"
                    ]
                  }
                ]
              },
              "_required": true,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c4c4bdc2db4468b457e"
            },
            {
              "_name": "mod_barrel",
              "_id": hashUtil.generate(),
              "_parent": "Executioner",
              "_props": {
                "filters": [
                  {
                    "Shift": 0,
                    "Filter": [
                      "5d2703038abbc3105103d94c",
                      "5bfebc250db834001a6694e1",
                      "5bfebc320db8340019668d79",
                      "5d2702e88abbc31ed91efc44"
                    ]
                  }
                ]
              },
              "_required": true,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c4c4bdc2db4468b457e"
            },
            {
              "_name": "mod_mount",
              "_id": hashUtil.generate(),
              "_parent": "Executioner",
              "_props": {
                "filters": [
                  {
                    "Shift": 0,
                    "Filter": [
                      "5cde7b43d7f00c000d36b93e",
                      "5bfebc5e0db834001a6694e5",
                      "5bfebc530db834001d23eb65"
                    ]
                  }
                ]
              },
              "_required": false,
              "_mergeSlotWithChildren": false,
              "_proto": "55d30c4c4bdc2db4468b457e"
            }
          ],
          defMagType: "ExecutionerOutdoorMag",
          defAmmo: "5fc382a9d724d907e2077dab",
          ammoCaliber: "Caliber86x70"
        },
        LocalePush: {
          Name: "The Executioner",
          ShortName: "Executioner",
          Description: "The Executioner. This is the final stop for many scavs and PMCs. It truly does live up to its name."
        },
        HandbookParent: HandbookIDs.BoltActionRifles,
        HandbookPrice: 91999,
        PushMastery: true,
        AddToBots: false,
        BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
        QuestPush: 
        {
          AddToQuests: false,
          QuestConditionType: "",
          QuestTargetConditionToClone: ""
        },
        LootPush: 
        {
          AddToStaticLoot: false,
          LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
          StaticLootProbability: 5
        },
        AddToCases: false,
        CasesToPush: [
          AllItemList.CONTAINER_DOCS,
          AllItemList.CONTAINER_SICC
        ],
        PushToFleaBlacklist: true,
        SlotInfo: {
          AddToSlot: false,
          Slot: 0
        }
      }
    }, tables, ragfair, jsonUtil);

    this.utils.createItem({
      newItem: {
        ItemToClone: ItemGenIDs.M700Outdoor,
        newID: "ExecutionerOutdoorMag",
        OverrideProperties: {
          Cartridges: [
              {
                "_name": "cartridges",
                "_id": hashUtil.generate(),
                "_max_count": 5,
                "_parent": "ExecutionerOutdoorMag",
                "_props": 
                  {"filters": [
                    {
                      "Filter": [
                        "5cde7b43d7f00c000d36b93e",
                        "5bfebc5e0db834001a6694e5",
                        "5bfebc530db834001d23eb65"
                    ]
                  }
                ]
              },
              "_proto": "5748538b2459770af276a261"
            }
          ]
        },
          LocalePush: {
              Name: "Executioner Wyatt Magazine",
              ShortName: "Executioner Mag",
              Description: "A custom Wyatt outdoor magazine for the Executioner sniper rifle. With the stopping power loaded inside, you probably only need one of these."
          },
          HandbookParent: HandbookIDs.Magazines,
          HandbookPrice: 14999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.CONTAINER_DOCS,
            AllItemList.CONTAINER_SICC
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        } 
      },tables, ragfair, jsonUtil)

      this.utils.createItem({
        newItem: {
        ItemToClone: ItemGenIDs.M700AICS,
        newID: "ExecutionerMagAICS",
        OverrideProperties: {
          Cartridges: [
              {
                "_name": "cartridges",
                "_id": hashUtil.generate(),
                "_max_count": 5,
                "_parent": "ExecutionerMagAICS",
                "_props": 
                  {"filters": [
                    {
                      "Filter": [
                        "5cde7b43d7f00c000d36b93e",
                        "5bfebc5e0db834001a6694e5",
                        "5bfebc530db834001d23eb65"
                    ]
                  }
                ]
              },
              "_proto": "5748538b2459770af276a261"
            }
          ]
        },
        LocalePush: {
          Name: "Executioner AICS Magazine",
          ShortName: "Executioner AICS",
          Description: "A custom AICS magazine for the Executioner sniper rifle. With the stopping power loaded inside, you probably only need one of these."
        },
        HandbookParent: HandbookIDs.Magazines,
        HandbookPrice: 14999,
        PushMastery: false,
        AddToBots: false,
        BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
        QuestPush: 
        {
          AddToQuests: false,
          QuestConditionType: "",
          QuestTargetConditionToClone: ""
        },
        LootPush: 
        {
          AddToStaticLoot: false,
          LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
          StaticLootProbability: 5
        },
        AddToCases: false,
        CasesToPush: [
          AllItemList.CONTAINER_DOCS,
          AllItemList.CONTAINER_SICC
        ],
        PushToFleaBlacklist: false,
        SlotInfo: {
          AddToSlot: false,
          Slot: 0
        }
      }
    }, tables, ragfair, jsonUtil);

    this.utils.createItem({
      newItem: {
        ItemToClone: ItemGenIDs.M700Pmag,
        newID: "ExecutionerMagPmag",
        OverrideProperties: {
          Cartridges: [
              {
                "_name": "cartridges",
                "_id": hashUtil.generate(),
                "_max_count": 5,
                "_parent": "ExecutionerMagPmag",
                "_props": 
                  {"filters": [
                    {
                      "Filter": [
                        "5cde7b43d7f00c000d36b93e",
                        "5bfebc5e0db834001a6694e5",
                        "5bfebc530db834001d23eb65"
                    ]
                  }
                ]
              },
              "_proto": "5748538b2459770af276a261"
            }
          ]
        },
          LocalePush: {
            Name: "Executioner PMAG",
            ShortName: "Executioner PMAG",
            Description: "A custom PMAG for the Executioner sniper rifle. With the stopping power loaded inside, you probably only need one of these."
          },
          HandbookParent: HandbookIDs.Magazines,
          HandbookPrice: 14999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_WEAPON_BOX_6X3,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.CONTAINER_DOCS,
            AllItemList.CONTAINER_SICC
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);
    
      newItem.addToWeaponShelf("Executioner");
      this.utils.addToStaticLoot(tables, "5909d89086f77472591234a0", "Executioner", 2);
      this.utils.addToStaticLoot(tables, "5909d7cf86f77470ee57d75a", "Executioner", 2);
      this.utils.addToStaticLoot(tables, "5909d76c86f77471e53d2adf", "Executioner", 2);
      this.utils.addToStaticLoot(tables, "5909d5ef86f77467974efbd8", "Executioner", 2);
      this.utils.addToStaticLoot(tables, "578f87ad245977356274f2cc", "Executioner", 2);

      //#endregion
    }

    public createGear(): void
    {
      const tables =        container.resolve<DatabaseServer>("DatabaseServer").getTables();
      const jsonUtil =      container.resolve<JsonUtil>("JsonUtil");
      const hashUtil =      container.resolve<HashUtil>("HashUtil");
      const configServer =  container.resolve<ConfigServer>("ConfigServer");
      const ragfair =       configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

      //#region Equipment/Gear
      this.utils.createItem({
        newItem: {
          ItemToClone: ItemGenIDs.Killa,
          newID: "Banshee",
          OverrideProperties: 
          {
            Prefab: {
              path: "ArmoredVests/banshee_armor.bundle",
              rcid: ""
            },
            Height: 3,
            Width: 3
          },
          LocalePush: 
          {
            Name: "Shellback Tactical Banshee plate carrier (Modified)",
            ShortName: "Banshee (M)",
            Description: "The Banshee Rifle Plate Carrier was designed to meet and exceed the needs of law enforcement, military, and tactical operators. This ultra lightweight, low profile, high-quality plate carrier has great load carrying capacity. \nIdeal for law enforcement patrol officers for use in high threat active shooter situations, multi-assault counter terrorism action capabilities (MACTAC) and counter terrorism direct actions."
          },
          HandbookParent: HandbookIDs.BodyArmor,
          HandbookPrice: 209999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: "",
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: true,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_WOODEN_CRATE,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.BACKPACK_6SH118
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
          ItemToClone: ItemGenIDs.Skanda,
          newID: "Rhino",
          OverrideProperties: 
          {
            Prefab: {
              path: "Rigs/rhino_rig.bundle",
              rcid: ""
            },
            Height: 3,
            Width: 4,
            Grids: [
              {
                  "_id": "62732cb3d803f8b5806da7c8",
                  "_name": "GridView (1)",
                  "_parent": "rorhinobonk",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 3,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": "ae2c3e0246c5c92c689ffa03",
                  "_name": "GridView (2)",
                  "_parent": "rorhinobonk",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 1,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": "a9db2d442c1e9dda0075db85",
                  "_name": "GridView (3)",
                  "_parent": "rorhinobonk",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": "72c5f5441bc18abdf47b44b9",
                  "_name": "GridView (4)",
                  "_parent": "rorhinobonk",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": "f3449f1f170ac4dd2f8021dd",
                  "_name": "GridView (5)",
                  "_parent": "rorhinobonk",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 4,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": "e27a0b8d0c6cf74aba601540",
                  "_name": "GridView (6)",
                  "_parent": "rorhinobonk",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 3,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": "6510c506a3613dc59fd589a2",
                  "_name": "GridView (7)",
                  "_parent": "rorhinobonk",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 1,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": "b8a21d49246b601fc69d3173",
                  "_name": "GridView (8)",
                  "_parent": "rorhinobonk",
                  "_props": {
                      "cellsH": 2,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              }
            ],
            RigLayoutName: "rorhinobonk"
          },
          LocalePush: 
          {
            Name: "CQC Rhino plate carrier (MTP)",
            ShortName: "Rhino Rig",
            Description: "Rhino is based on the Osprey body armour system but without neck, shoulder and groin protection. Rhino has proved to be a very popular system as it has a simple but effective design."
          },
          HandbookParent: HandbookIDs.TacticalRigs,
          HandbookPrice: 239999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: "",
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.BACKPACK_6SH118
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
          ItemToClone: ItemGenIDs.DeathMask,
          newID: "KnightMask",
          OverrideProperties: 
          {
            Prefab: {
              path: "FaceCover/knight_mask_no_wires.bundle",
              rcid: ""
            },
            BlocksEarpiece: false,
            BlocksEyewear: false,
            BlocksHeadwear: false,
            BlocksFaceCover: false,
            ConflictingItems: [],
            armorClass: 6
          },
          LocalePush: 
          {
            Name: "Death Knight mask (Modified)",
            ShortName: "Death Knight (M)",
            Description: "A unique mask of the commander of the Goons squad, former USEC operators who decided not to flee Tarkov, but to create their own order. Compatible with headwear."
          },
          HandbookParent: HandbookIDs.Facecovers,
          HandbookPrice: 159999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: "",
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.BACKPACK_6SH118
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
          ItemToClone: ItemGenIDs.SSOAttack,
          newID: "RPatrolBackpack",
          OverrideProperties: 
          {
            Prefab: {
              path: "assets/content/items/equipment/backpack_tehinkom_patrol/item_equipment_backpack_tehinkom_patrol.bundle",
              rcid: ""
            },
            Width: 5,
            Height: 7,
            Grids: [
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (1)",
                  "_parent": "RPatrolBackpack",
                  "_props": {
                      "cellsH": 2,
                      "cellsV": 7,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (2)",
                  "_parent": "RPatrolBackpack",
                  "_props": {
                      "cellsH": 4,
                      "cellsV": 7,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              }
            ]
          },
          LocalePush: 
          {
            Name: "Custom Tehinkom Patrol Backpack (Modified)",
            ShortName: "RBP (M)",
            Description: "A custom 60-liter Patrol backpack for carrying personal belongings and equipment through tough field conditions."
          },
          HandbookParent: HandbookIDs.Backpacks,
          HandbookPrice: 139999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: "",
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.BACKPACK_6SH118
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
          ItemToClone: ItemGenIDs.SSOAttack,
          newID: "RDragonEgg",
          OverrideProperties: 
          {
            Prefab: {
              path: "assets/content/items/equipment/backpack_dragon_egg_mk_ii/item_equipment_backpack_dragon_egg_mk_ii.bundle",
              rcid: ""
            },
            Width: 4,
            Height: 5,
            Grids: [
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (1)",
                  "_parent": "RDragonEgg",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 5,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (2)",
                  "_parent": "RDragonEgg",
                  "_props": {
                      "cellsH": 3,
                      "cellsV": 7,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (3)",
                  "_parent": "RDragonEgg",
                  "_props": {
                      "cellsH": 2,
                      "cellsV": 9,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              }
            ]
          },
          LocalePush: 
          {
            Name: "Custom Dragon Egg MK II (Modified)",
            ShortName: "MKII (M)",
            Description: "A custom backpack designed to carry large amounts of specialized medical equipment and supplies. Manufactured by London Bridge Trading and modified by the Requisitions Office."
          },
          HandbookParent: HandbookIDs.Backpacks,
          HandbookPrice: 99999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: "",
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.BACKPACK_6SH118
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
          ItemToClone: ItemGenIDs.SSOAttack,
          newID: "RSAT1",
          OverrideProperties: 
          {
            Prefab: {
              path: "assets/content/items/equipment/backpack_mystery_ranch_satl/item_equipment_backpack_mystery_ranch_satl.bundle",
              rcid: ""
            },
            Width: 5,
            Height: 7,
            Grids: [
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (1)",
                  "_parent": "RSAT1",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 7,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (2)",
                  "_parent": "RSAT1",
                  "_props": {
                      "cellsH": 4,
                      "cellsV": 9,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (3)",
                  "_parent": "RSAT1",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 7,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              }
            ]
          },
          LocalePush: 
          {
            Name: "Custom Mystery Ranch SAT1 backpack (Modified)",
            ShortName: "SAT1 (M)",
            Description: "A custom Mystery Ranch SAT1 backpack that is part of the 2nd generation Ratnik gear kit for combat. The SAT1 tactical army backpack is a modernization of the 6B38 Permyachka model raid backpack. The 6B38 backpack is designed to carry fire support equipment, weapons, ammunition, elements of mountain equipment, as well as the personal belongings of individual soldiers. The backpack can be used during combat operations, long hikes, and raid events."
          },
          HandbookParent: HandbookIDs.Backpacks,
          HandbookPrice: 149999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: "",
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.BACKPACK_6SH118
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
          ItemToClone: ItemGenIDs.Skanda,
          newID: "OspreyArmless",
          OverrideProperties: 
          {
            Prefab: {
              path: "Rigs/osprey_def_armless_rig.bundle",
              rcid: ""
            },
            Grids: [
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (1)",
                  "_parent": "robigrig",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 1,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (2)",
                  "_parent": "robigrig",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 1,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (3)",
                  "_parent": "robigrig",
                  "_props": {
                      "cellsH": 2,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (4)",
                  "_parent": "robigrig",
                  "_props": {
                      "cellsH": 2,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (5)",
                  "_parent": "robigrig",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (6)",
                  "_parent": "robigrig",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (7)",
                  "_parent": "robigrig",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 1,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (8)",
                  "_parent": "robigrig",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 1,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (9)",
                  "_parent": "robigrig",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 4,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (10)",
                  "_parent": "robigrig",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 1,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              }
            ],
            RigLayoutName: "robigrig"
          },
          LocalePush: 
          {
            Name: "CQC Osprey MK4A plate carrier (Protection-Light, MTP)",
            ShortName: "Osprey MK4A rig (PL)",
            Description: "The Osprey plate carrier is actively used by the British army and specialists. The Protection preset is provided with heavy armor plates and the optimal number of pouches for ammunition, grenades and special equipment."
          },
          HandbookParent: HandbookIDs.TacticalRigs,
          HandbookPrice: 189999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: "",
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.BACKPACK_6SH118
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
          ItemToClone: AllItemList.BACKPACK_COMM_3,
          newID: "nicecommRO",
          OverrideProperties: {
                Prefab: {
                  path: "Backpacks/nice_comm_3_bvs.bundle",
                  rcid: ""
                },
                Grids: [
                  {
                    "_id": hashUtil.generate(),
                    "_name": "GridView (1)",
                    "_parent": "nicecommRO",
                    "_props": {
                        "cellsH": 3,
                        "cellsV": 10,
                        "filters": [
                            {
                                "ExcludedFilter": [
                                    "5448bf274bdc2dfc2f8b456a"
                                ],
                                "Filter": [
                                    "54009119af1c881c07000029"
                                ]
                            }
                        ],
                        "isSortingTable": false,
                        "maxCount": 0,
                        "maxWeight": 0,
                        "minCount": 0
                    },
                    "_proto": "55d329c24bdc2d892f8b4567"
                  },
                  {
                    "_id": hashUtil.generate(),
                    "_name": "GridView (2)",
                    "_parent": "nicecommRO",
                    "_props": {
                        "cellsH": 3,
                        "cellsV": 10,
                        "filters": [
                            {
                                "ExcludedFilter": [
                                    "5448bf274bdc2dfc2f8b456a"
                                ],
                                "Filter": [
                                    "54009119af1c881c07000029"
                                ]
                            }
                        ],
                        "isSortingTable": false,
                        "maxCount": 0,
                        "maxWeight": 0,
                        "minCount": 0
                    },
                    "_proto": "55d329c24bdc2d892f8b4567"
                  }
                ]
              },
              LocalePush: {
                Name: "Mystery Ranch NICE COMM 3 BVS frame system (tan)",
                ShortName: "COMM 3",
                Description: "The NICE Frame special system for carrying oversized or heavy loads with an installed COMM 3 backpack for carrying radio systems.\nThe COMM 3 main bay is designed for PRC117F or G, PRC119F, 152, or ASIP radios. The Hitchhiker and Daypack lid allows you to carry separate gear if needed. The modular NICE COMM 3 system is ready to adapt to changing tasks.\nAn extremely rare thing, for which a real hunt is conducted in Tarkov."
              },
              HandbookParent: HandbookIDs.Backpacks,
              HandbookPrice: 43999,
              PushMastery: false,
              AddToBots: false,
              BotLootItemToClone: "",
              QuestPush: {
                  AddToQuests: false,
                  QuestConditionType: "",
                  QuestTargetConditionToClone: ""
              },
              LootPush: {
                  AddToStaticLoot: false,
                  LootContainersToAdd: "",
                  StaticLootProbability: 0
              },
              AddToCases: false,
              CasesToPush: [""],
              PushToFleaBlacklist: false,
              SlotInfo: {
                AddToSlot: false,
                Slot: 0
              }
            }
          }, tables, ragfair, jsonUtil);
      //#endregion
      //
      //
      //
      //#region Requisition Slips
      this.utils.createItem({
        newItem: {
          ItemToClone: AllItemList.INFO_INTELLIGENCE,
          newID: "RequisitionSlips",
          OverrideProperties: 
          {
            Prefab: {
              path: "Items/ReqSlip.bundle",
              rcid: ""
            },
            Height: 1,
            Width: 2
          },
          LocalePush: 
          {
            Name: "Requisition Slips",
            ShortName: "Reqs",
            Description: "A requisition slip used to trade with the Requisitions Office. You'll want to keep a stack of these handy in case you run into trouble and need some quick provisions."
          },
          HandbookParent: HandbookIDs.InfoItems,
          HandbookPrice: 51999,
          PushMastery: false,
          AddToBots: true,
          BotLootItemToClone: AllItemList.KEYCARD_ACCESS,
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: true,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 5
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.CONTAINER_DOCS,
            AllItemList.CONTAINER_SICC
          ],
          PushToFleaBlacklist: false,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.addToCases(tables, "590c60fc86f77412b13fddcf", "RequisitionSlips");
      this.utils.addToCases(tables, "5d235bb686f77443f4331278", "RequisitionSlips");
      //#endregion
      //
      //
      //
      //#region Secure Containers
      this.utils.createItem({
        newItem: {
          ItemToClone: AllItemList.SECURE_WAIST_POUCH,
          newID: "WaistPouch",
          OverrideProperties: 
          {
            Grids: [
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (1)",
                  "_parent": "WaistPouch",
                  "_props": {
                      "cellsH": 2,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (2)",
                  "_parent": "WaistPouch",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              }
            ]
          },
          LocalePush: 
          {
            Name: "Custom Waist Pouch",
            ShortName: "CWP",
            Description: "A modified Waist Pouch with more storage sown into it. It is a durable and convenient waist pouch for a variety of things you would want to keep close."
          },
          HandbookParent: HandbookIDs.SecureContainers,
          HandbookPrice: 99999999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: AllItemList.BARTER_LEDX,
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 0
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.SECURE_KAPPA,
            AllItemList.SECURE_EPSILON
          ],
          PushToFleaBlacklist: true,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
          ItemToClone: AllItemList.SECURE_ALPHA,
          newID: "Alpha",
          OverrideProperties: 
          {
            Grids: [
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (1)",
                  "_parent": "Alpha",
                  "_props": {
                      "cellsH": 2,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (2)",
                  "_parent": "Alpha",
                  "_props": {
                      "cellsH": 2,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              }
            ]
          },
          LocalePush: 
          {
            Name: "Custom Secure Container Alpha",
            ShortName: "CSCA",
            Description: "A modified Alpha Container with more storage compartments added. A small secure container used by PMCs formerly deployed in Tarkov."
          },
          HandbookParent: HandbookIDs.SecureContainers,
          HandbookPrice: 99999999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: AllItemList.BARTER_LEDX,
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 0
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.SECURE_KAPPA,
            AllItemList.SECURE_EPSILON
          ],
          PushToFleaBlacklist: true,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
          ItemToClone: AllItemList.SECURE_BETA,
          newID: "Beta",
          OverrideProperties: 
          {
            Grids: [
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (1)",
                  "_parent": "Beta",
                  "_props": {
                      "cellsH": 3,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (2)",
                  "_parent": "Beta",
                  "_props": {
                      "cellsH": 2,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              }
            ]
          },
          LocalePush: 
          {
            Name: "Custom Secure Container Beta",
            ShortName: "CSCB",
            Description: "A modified Beta Container with more storage compartments added. A medium-sized secure container used by PMCs formerly deployed in Tarkov."
          },
          HandbookParent: HandbookIDs.SecureContainers,
          HandbookPrice: 99999999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: AllItemList.BARTER_LEDX,
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 0
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.SECURE_KAPPA,
            AllItemList.SECURE_EPSILON
          ],
          PushToFleaBlacklist: true,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
          ItemToClone: AllItemList.SECURE_GAMMA,
          newID: "Gamma",
          OverrideProperties: 
          {
            Grids: [
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (1)",
                  "_parent": "Gamma",
                  "_props": {
                      "cellsH": 3,
                      "cellsV": 3,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (2)",
                  "_parent": "Gamma",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (3)",
                  "_parent": "Gamma",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 1,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              }
            ]
          },
          LocalePush: 
          {
            Name: "Custom Secure Container Gamma",
            ShortName: "CSCG",
            Description: "A modified Gamma Container with more storage compartments added. A unique secure container used only by veteran PMCs formerly deployed in Tarkov."
          },
          HandbookParent: HandbookIDs.SecureContainers,
          HandbookPrice: 99999999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: AllItemList.BARTER_LEDX,
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 0
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.SECURE_KAPPA,
            AllItemList.SECURE_EPSILON
          ],
          PushToFleaBlacklist: true,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
          ItemToClone: AllItemList.SECURE_EPSILON,
          newID: "Epsilon",
          OverrideProperties: 
          {
            Grids: [
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (1)",
                  "_parent": "Epsilon",
                  "_props": {
                      "cellsH": 3,
                      "cellsV": 3,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (2)",
                  "_parent": "Epsilon",
                  "_props": {
                      "cellsH": 2,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (3)",
                  "_parent": "Epsilon",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              }
            ]
          },
          LocalePush: 
          {
            Name: "Custom Secure Container Epsilon",
            ShortName: "CSCE",
            Description: "A modified Epsilon Container with more storage compartments added. One of TerraGroup's latest inventions in secure container technology - the Epsilon secured container."
          },
          HandbookParent: HandbookIDs.SecureContainers,
          HandbookPrice: 99999999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: AllItemList.BARTER_LEDX,
          QuestPush: 
          {
            AddToQuests: true,
            QuestConditionType: "HandoverItem",
            QuestTargetConditionToClone: "59db794186f77448bc595262"
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 0
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.SECURE_KAPPA,
            AllItemList.SECURE_EPSILON
          ],
          PushToFleaBlacklist: true,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);

      this.utils.createItem({
        newItem: {
          ItemToClone: AllItemList.SECURE_KAPPA,
          newID: "Kappa",
          OverrideProperties: 
          {
            Grids: [
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (1)",
                  "_parent": "Kappa",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 3,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (2)",
                  "_parent": "Kappa",
                  "_props": {
                      "cellsH": 3,
                      "cellsV": 4,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": hashUtil.generate(),
                  "_name": "GridView (3)",
                  "_parent": "Kappa",
                  "_props": {
                      "cellsH": 2,
                      "cellsV": 3,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  ""
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              }
            ]
          },
          LocalePush: 
          {
            Name: "Custom Secure Container Kappa",
            ShortName: "CSCK",
            Description: "A modified Kappa Container with more storage compartments added. A secret TerraGroup invention - the Kappa secured container."
          },
          HandbookParent: HandbookIDs.SecureContainers,
          HandbookPrice: 99999999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: AllItemList.BARTER_LEDX,
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 0
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.SECURE_KAPPA,
            AllItemList.SECURE_EPSILON
          ],
          PushToFleaBlacklist: true,
          SlotInfo: {
            AddToSlot: false,
            Slot: 0
          }
        }
      }, tables, ragfair, jsonUtil);
      //#endregion
      //
      //
      //
      //#region Armbands
      this.utils.createItem({
        newItem: {
          ItemToClone: ItemGenIDs.ScavVest,
          newID: "DeadArmband",
          OverrideProperties: 
          {
            Prefab: {
              path: "assets/content/items/equipment/armband/item_equipment_armband_dead.bundle",
              rcid: ""
            },
            Height: 1,
            Width: 1,
            Weight: -10,
            Grids: [
              {
                  "_id": "7cf6637936909f0d9e3903e9",
                  "_name": "GridView (1)",
                  "_parent": "rodeadarmband",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 1,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": "21ac9c1e506186eeb4119de4",
                  "_name": "GridView (2)",
                  "_parent": "rodeadarmband",
                  "_props": {
                      "cellsH": 2,
                      "cellsV": 2,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": "3438e04b9f8142a9aef4a34b",
                  "_name": "GridView (3)",
                  "_parent": "rodeadarmband",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 1,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": "3d510188ca90cff286882a0d",
                  "_name": "GridView (4)",
                  "_parent": "rodeadarmband",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 3,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              },
              {
                  "_id": "eb3431a9487dde2cfc88ec82",
                  "_name": "GridView (5)",
                  "_parent": "rodeadarmband",
                  "_props": {
                      "cellsH": 1,
                      "cellsV": 1,
                      "filters": [
                          {
                              "ExcludedFilter": [
                                  "5448bf274bdc2dfc2f8b456a"
                              ],
                              "Filter": [
                                  "54009119af1c881c07000029"
                              ]
                          }
                      ],
                      "isSortingTable": false,
                      "maxCount": 0,
                      "maxWeight": 0,
                      "minCount": 0
                  },
                  "_proto": "55d329c24bdc2d892f8b4567"
              }
            ],
            RigLayoutName: "rodeadarmband"
          },
          LocalePush: 
          {
            Name: "Custom Deadskul Carrying Pouch",
            ShortName: "Dead",
            Description: "A modified Deadskul Armband with pouches sown into it. Now you can be sure to never go into the field without extra provisions. The Requisition Officers really knew what they were doing with this one. Only for real collectors."
          },
          HandbookParent: HandbookIDs.GearComponents,
          HandbookPrice: 99999999,
          PushMastery: false,
          AddToBots: false,
          BotLootItemToClone: "",
          QuestPush: 
          {
            AddToQuests: false,
            QuestConditionType: "",
            QuestTargetConditionToClone: ""
          },
          LootPush: 
          {
            AddToStaticLoot: false,
            LootContainersToAdd: AllItemList.LOOTCONTAINER_SAFE,
            StaticLootProbability: 0
          },
          AddToCases: false,
          CasesToPush: [
            AllItemList.SECURE_KAPPA,
            AllItemList.SECURE_EPSILON
          ],
          PushToFleaBlacklist: true,
          SlotInfo: {
            AddToSlot: true,
            Slot: 14
          }
        }
      }, tables, ragfair, jsonUtil);
      //#endregion
      //
      //
      //
      //#region Clothes
      this.utils.createClothingTop({
        NewOutfitID: "ROtshirtBlack",
        BundlePath: "Clothing/top_tshirt_black.bundle",
        HandsToClone: "5d1f5aa286f7744bca3f0b9c",
        HandsBundlePath: "assets/content/hands/hands_tshirt_bear_black/hands_tshirt_bear_black.skin.bundle"
      }, tables, jsonUtil);

      this.utils.createClothingBottom({
        NewBottomsID: "ROurbanresponder",
        BundlePath: "Clothing/bottom_urbanresponder_ucp.bundle"
      }, tables, jsonUtil);
      //#endregion
    }
}