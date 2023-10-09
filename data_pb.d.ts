// package: 
// file: data.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Marker extends jspb.Message { 
    getX(): number;
    setX(value: number): Marker;
    getY(): number;
    setY(value: number): Marker;
    getId(): number;
    setId(value: number): Marker;
    getTitle(): string;
    setTitle(value: string): Marker;
    getContent(): string;
    setContent(value: string): Marker;
    getPicture(): string;
    setPicture(value: string): Marker;
    clearItemList(): void;
    getItemList(): Array<number>;
    setItemList(value: Array<number>): Marker;
    addItem(value: number, index?: number): number;
    getUnderground(): string;
    setUnderground(value: string): Marker;
    getVideo(): string;
    setVideo(value: string): Marker;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Marker.AsObject;
    static toObject(includeInstance: boolean, msg: Marker): Marker.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Marker, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Marker;
    static deserializeBinaryFromReader(message: Marker, reader: jspb.BinaryReader): Marker;
}

export namespace Marker {
    export type AsObject = {
        x: number,
        y: number,
        id: number,
        title: string,
        content: string,
        picture: string,
        itemList: Array<number>,
        underground: string,
        video: string,
    }
}

export class AreaItem extends jspb.Message { 
    getId(): number;
    setId(value: number): AreaItem;
    getName(): string;
    setName(value: string): AreaItem;
    getIcon(): number;
    setIcon(value: number): AreaItem;
    clearTypeList(): void;
    getTypeList(): Array<number>;
    setTypeList(value: Array<number>): AreaItem;
    addType(value: number, index?: number): number;
    clearMarkerList(): void;
    getMarkerList(): Array<number>;
    setMarkerList(value: Array<number>): AreaItem;
    addMarker(value: number, index?: number): number;
    getCount(): number;
    setCount(value: number): AreaItem;
    getRefreshTime(): number;
    setRefreshTime(value: number): AreaItem;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AreaItem.AsObject;
    static toObject(includeInstance: boolean, msg: AreaItem): AreaItem.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AreaItem, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AreaItem;
    static deserializeBinaryFromReader(message: AreaItem, reader: jspb.BinaryReader): AreaItem;
}

export namespace AreaItem {
    export type AsObject = {
        id: number,
        name: string,
        icon: number,
        typeList: Array<number>,
        markerList: Array<number>,
        count: number,
        refreshTime: number,
    }
}

export class Area extends jspb.Message { 
    getName(): string;
    setName(value: string): Area;
    clearChildList(): void;
    getChildList(): Array<Area>;
    setChildList(value: Array<Area>): Area;
    addChild(value?: Area, index?: number): Area;
    clearItemList(): void;
    getItemList(): Array<number>;
    setItemList(value: Array<number>): Area;
    addItem(value: number, index?: number): number;
    getMapId(): string;
    setMapId(value: string): Area;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Area.AsObject;
    static toObject(includeInstance: boolean, msg: Area): Area.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Area, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Area;
    static deserializeBinaryFromReader(message: Area, reader: jspb.BinaryReader): Area;
}

export namespace Area {
    export type AsObject = {
        name: string,
        childList: Array<Area.AsObject>,
        itemList: Array<number>,
        mapId: string,
    }
}

export class MapInfo extends jspb.Message { 
    getId(): string;
    setId(value: string): MapInfo;
    getOriginX(): number;
    setOriginX(value: number): MapInfo;
    getOriginY(): number;
    setOriginY(value: number): MapInfo;
    getWidth(): number;
    setWidth(value: number): MapInfo;
    getHeight(): number;
    setHeight(value: number): MapInfo;
    getTileOffsetX(): number;
    setTileOffsetX(value: number): MapInfo;
    getTileOffsetY(): number;
    setTileOffsetY(value: number): MapInfo;
    clearTeleportList(): void;
    getTeleportList(): Array<number>;
    setTeleportList(value: Array<number>): MapInfo;
    addTeleport(value: number, index?: number): number;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MapInfo.AsObject;
    static toObject(includeInstance: boolean, msg: MapInfo): MapInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MapInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MapInfo;
    static deserializeBinaryFromReader(message: MapInfo, reader: jspb.BinaryReader): MapInfo;
}

export namespace MapInfo {
    export type AsObject = {
        id: string,
        originX: number,
        originY: number,
        width: number,
        height: number,
        tileOffsetX: number,
        tileOffsetY: number,
        teleportList: Array<number>,
    }
}

export class ItemType extends jspb.Message { 
    getId(): number;
    setId(value: number): ItemType;
    getIcon(): number;
    setIcon(value: number): ItemType;
    getName(): string;
    setName(value: string): ItemType;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ItemType.AsObject;
    static toObject(includeInstance: boolean, msg: ItemType): ItemType.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ItemType, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ItemType;
    static deserializeBinaryFromReader(message: ItemType, reader: jspb.BinaryReader): ItemType;
}

export namespace ItemType {
    export type AsObject = {
        id: number,
        icon: number,
        name: string,
    }
}

export class UndergroundMapChunk extends jspb.Message { 
    clearBoundList(): void;
    getBoundList(): Array<number>;
    setBoundList(value: Array<number>): UndergroundMapChunk;
    addBound(value: number, index?: number): number;
    getUrl(): string;
    setUrl(value: string): UndergroundMapChunk;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UndergroundMapChunk.AsObject;
    static toObject(includeInstance: boolean, msg: UndergroundMapChunk): UndergroundMapChunk.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UndergroundMapChunk, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UndergroundMapChunk;
    static deserializeBinaryFromReader(message: UndergroundMapChunk, reader: jspb.BinaryReader): UndergroundMapChunk;
}

export namespace UndergroundMapChunk {
    export type AsObject = {
        boundList: Array<number>,
        url: string,
    }
}

export class UndergroundMap extends jspb.Message { 
    getId(): string;
    setId(value: string): UndergroundMap;
    getName(): string;
    setName(value: string): UndergroundMap;
    clearChildList(): void;
    getChildList(): Array<UndergroundMap>;
    setChildList(value: Array<UndergroundMap>): UndergroundMap;
    addChild(value?: UndergroundMap, index?: number): UndergroundMap;
    clearChunkList(): void;
    getChunkList(): Array<UndergroundMapChunk>;
    setChunkList(value: Array<UndergroundMapChunk>): UndergroundMap;
    addChunk(value?: UndergroundMapChunk, index?: number): UndergroundMapChunk;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UndergroundMap.AsObject;
    static toObject(includeInstance: boolean, msg: UndergroundMap): UndergroundMap.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UndergroundMap, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UndergroundMap;
    static deserializeBinaryFromReader(message: UndergroundMap, reader: jspb.BinaryReader): UndergroundMap;
}

export namespace UndergroundMap {
    export type AsObject = {
        id: string,
        name: string,
        childList: Array<UndergroundMap.AsObject>,
        chunkList: Array<UndergroundMapChunk.AsObject>,
    }
}

export class MapData extends jspb.Message { 
    clearAreaList(): void;
    getAreaList(): Array<Area>;
    setAreaList(value: Array<Area>): MapData;
    addArea(value?: Area, index?: number): Area;
    clearItemTypeList(): void;
    getItemTypeList(): Array<ItemType>;
    setItemTypeList(value: Array<ItemType>): MapData;
    addItemType(value?: ItemType, index?: number): ItemType;

    getItemMap(): jspb.Map<number, AreaItem>;
    clearItemMap(): void;

    getMarkerMap(): jspb.Map<number, Marker>;
    clearMarkerMap(): void;

    getMapInfoMap(): jspb.Map<string, MapInfo>;
    clearMapInfoMap(): void;
    clearUndergroundMapList(): void;
    getUndergroundMapList(): Array<UndergroundMap>;
    setUndergroundMapList(value: Array<UndergroundMap>): MapData;
    addUndergroundMap(value?: UndergroundMap, index?: number): UndergroundMap;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MapData.AsObject;
    static toObject(includeInstance: boolean, msg: MapData): MapData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MapData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MapData;
    static deserializeBinaryFromReader(message: MapData, reader: jspb.BinaryReader): MapData;
}

export namespace MapData {
    export type AsObject = {
        areaList: Array<Area.AsObject>,
        itemTypeList: Array<ItemType.AsObject>,

        itemMap: Array<[number, AreaItem.AsObject]>,

        markerMap: Array<[number, Marker.AsObject]>,

        mapInfoMap: Array<[string, MapInfo.AsObject]>,
        undergroundMapList: Array<UndergroundMap.AsObject>,
    }
}
