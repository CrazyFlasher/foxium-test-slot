import {IHierarchyObject, IHierarchyObjectImmutable, MessageType} from "domwires";

export type Result = {
    readonly winAmount: number;
    readonly stopPositions: number[];
};

export class NetServiceMessageType extends MessageType
{
    public static readonly GOT_RESPONSE: NetServiceMessageType = new NetServiceMessageType();
}

export interface INetServiceImmutable extends IHierarchyObjectImmutable
{
    get result(): Result;
}

export interface INetService extends INetServiceImmutable, IHierarchyObject
{
    spin(): void;
}