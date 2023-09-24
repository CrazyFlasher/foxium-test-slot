import {IHierarchyObject, MessageType} from "domwires";

export class SceneMediatorMessageType extends MessageType
{
    public static readonly SPIN: SceneMediatorMessageType = new SceneMediatorMessageType();
    public static readonly FULL_SCREEN: SceneMediatorMessageType = new SceneMediatorMessageType();
}

export interface ISceneMediator extends IHierarchyObject
{

}