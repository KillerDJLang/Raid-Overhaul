import type { References } from "../Utils/References";
import { CustomMap } from "./GenEnums";

export class SlotUtil {
    constructor(private ref: References) {}

    public buildSlots(): void {
        const items = this.ref.tables.templates.items;

        items[CustomMap.Aug762]._props.Slots[0]._props.filters[0].Filter = [CustomMap.Aug30Rd, CustomMap.Aug42Rd];

        items[CustomMap.Stm46]._props.Slots[1]._props.filters[0].Filter = [CustomMap.Stm33Rd, CustomMap.Stm50Rd];
        items[CustomMap.Stm46]._props.Slots[2]._props.filters[0].Filter = [CustomMap.StmRec];

        items[CustomMap.Mcm4]._props.Slots[1]._props.filters[0].Filter.push(CustomMap.Mag300);
        items[CustomMap.Mcm4]._props.Slots[1]._props.filters[0].Filter.push(CustomMap.Mag545);
        items[CustomMap.Mcm4]._props.Slots[1]._props.filters[0].Filter.push(CustomMap.Mag57);
        items[CustomMap.Mcm4]._props.Slots[1]._props.filters[0].Filter.push(CustomMap.Mag762);
        items[CustomMap.Mcm4]._props.Slots[1]._props.filters[0].Filter.push(CustomMap.Mag939);
        items[CustomMap.Mcm4]._props.Slots[2]._props.filters[0].Filter.push(CustomMap.Rec300);
        items[CustomMap.Mcm4]._props.Slots[2]._props.filters[0].Filter.push(CustomMap.Rec545);
        items[CustomMap.Mcm4]._props.Slots[2]._props.filters[0].Filter.push(CustomMap.Rec57);
        items[CustomMap.Mcm4]._props.Slots[2]._props.filters[0].Filter.push(CustomMap.Rec762);
        items[CustomMap.Mcm4]._props.Slots[2]._props.filters[0].Filter.push(CustomMap.Rec939);

        items[CustomMap.Judge]._props.Slots[3]._props.filters[0].Filter = [
            CustomMap.Judge17Rd,
            CustomMap.Judge33Rd,
            CustomMap.Judge50Rd,
        ];
        items[CustomMap.Judge]._props.Slots[2]._props.filters[0].Filter = [CustomMap.JudgeSlide];

        items[CustomMap.Jury]._props.Slots[1]._props.filters[0].Filter = [
            CustomMap.Jury20Rd,
            CustomMap.Jury25Rd,
            CustomMap.Jury50Rd,
        ];
        items[CustomMap.Jury]._props.Slots[2]._props.filters[0].Filter = [CustomMap.JuryRec];

        items[CustomMap.Exec]._props.Slots[0]._props.filters[0].Filter = [
            CustomMap.ExecAics,
            CustomMap.ExecPmag,
            CustomMap.ExecWyatt,
        ];
/*
        items[CustomMap.L85]._props.Slots[0]._props.filters[0].Filter = [CustomMap.L85PistolGrip];
        items[CustomMap.L85]._props.Slots[2]._props.filters[0].Filter = [CustomMap.L85DDRail, CustomMap.L85StRail];
        items[CustomMap.L85]._props.Slots[3]._props.filters[0].Filter = [CustomMap.L85Barrel];
        items[CustomMap.L85]._props.Slots[4]._props.filters[0].Filter = [
            CustomMap.L85OpticRail,
            CustomMap.L85CarryHandle,
        ];
        items[CustomMap.L85Barrel]._props.Slots[0]._props.filters[0].Filter.push(CustomMap.L85FlashHider);
        items[CustomMap.L85Barrel]._props.Slots[1]._props.filters[0].Filter = [CustomMap.L85FrontSight];

        items[CustomMap.Famas488Barrel]._props.Slots[0]._props.filters[0].Filter.push(CustomMap.FamasFlashHider);
        items[CustomMap.FamasRec]._props.Slots[0]._props.filters[0].Filter = [CustomMap.Famas488Barrel];
        items[CustomMap.FamasRec]._props.Slots[1]._props.filters[0].Filter = [CustomMap.FamasOpticRail];
        items[CustomMap.FamasRec]._props.Slots[2]._props.filters[0].Filter = [CustomMap.FamasSideRail];
        items[CustomMap.Famas]._props.Slots[0]._props.filters[0].Filter = [CustomMap.Famas25Rd, CustomMap.Famas30Rd];
        items[CustomMap.Famas]._props.Slots[2]._props.filters[0].Filter = [CustomMap.FamasRec];
*/
    }
}
