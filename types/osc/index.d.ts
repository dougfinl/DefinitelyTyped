// Type definitions for osc
// Project: https://github.com/colinbdclark/osc.js
// Definitions by: Douglas Finlay <https://github.com/dougfinl>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />
/// <reference types="ws" />

import { EventEmitter } from 'events';
import { Socket } from 'net';
import * as WebSocket from 'ws';

export interface TimeTag {
    raw: [number, number];
    native: number;
}

/**
 * A Message consists of an address and arguments.
 */
export interface Message {
    address: string;
    // TODO: RawArgument | TypeAnnotated
    args: Array<TypeAnnotatedArgument>;
}

/**
 * A Bundle consists of a TimeTag and an array of Packets.
 */
export interface Bundle {
    timeTag: TimeTag;
    packets: Array<Bundle | Message>;
}

/**
 * A Packet is either a Bundle or a Message.
 */
export type Packet = Message | Bundle;

/**
 * An OSC data type annotation.
 *
 * ```none
 * - F  false
 * - I  infinitum/impulse
 * - N  null
 * - S  alternate type represented as an OSC string
 * - T  true
 * - b  OSC blob(int32 size count n, followed by n 8-bit bytes of binary data)
 * - c  an ascii character represented as 32 bits
 * - d  64-bit double (IEEE 754)
 * - f  32-bit float (big-endian IEEE 754)
 * - h  64 bit signed integer (big-endian two’s complement)
 * - i  32-bit signed integer (big-endian 2'S compliment)
 * - m  4 byte MIDI message. Bytes from MSB to LSB are: port id, status byte, data1, data2
 * - r  32 bit RGBA color with each channel stored as an 8-bit value
 * - s  OSC string (null-terminated sequence of ASCII chars, padded to 32-bits with null chars)
 * - t  OSC timetag (64-bit big-endian fixed-point NTP timestamp)
 * ```
 */
export type TypeTag = 'F' | 'I' | 'N' | 'S' | 'T' | 'b' | 'c' | 'd' | 'f' | 'h' | 'i' | 'm' | 'r' | 's' | 't';

/**
 * A value with its associated OSC data type.
 */
export interface TypeAnnotatedArgument {
    type: TypeTag;
    value: any;
}

/** An RGBA quadruplet */
export interface RGBAColour {
    /** Red component in the range 0 - 255 */
    r: number;

    /** Green component in the range 0 - 255 */
    g: number;

    /** Blue component in the range 0 - 255 */
    b: number;

    /** Alpha component in the range 0 - 1 */
    a: number;
}

export interface Options {
    metadata: boolean;
    unpackSingleArgs: boolean;
}

export interface OffsetState {
    idx: number;
    length: number;
}

export interface Options {
    metadata: boolean;
    unpackSingleArgs: boolean;
}

// TODO: non-API?
// export const SECS_70YRS: number;

// TODO: non-API?
// export const TWO_32: number;

// TODO: non-API?
// export const defaults: {
//     metadata: boolean;
//     unpackSingleArgs: boolean;
// };

/**
 * Reads an OSC-formatted string.
 *
 * @param dv the raw bytes of the OSC string
 * @param offsetState the current offset index into dv
 * @return the string that was read
 */
export function readString(dv: DataView, offsetState: OffsetState): string;

/**
 * Writes a JavaScript string as an OSC-formatted string.
 *
 * @param str the string to write
 * @return a buffer containing the OSC-formatted string
 */
export function writeString(str: string): Uint8Array;

/**
 * Reads an OSC int32 ("i") value.
 *
 * @param dv a DataView containing the raw bytes
 * @param offsetState the current offset index into dv
 * @return the number that was read
 */
export function readInt32(dv: DataView, offsetState: OffsetState): number;

/**
 * Writes an OSC int32 ("i") value.
 *
 * @param val the number to write
 * @param dv a DataView instance to write the number into
 * @param offset an offset into dv
 */
export function writeInt32(val: number, dv?: DataView, offset?: number): Uint8Array;

/**
 * Reads an OSC int64 ("h") value.
 *
 * @param dv a DataView containing the raw bytes
 * @param offsetState an offsetState object used to store the current offset index into dv
 * @return the number that was read
 */
export function readInt64(dv: DataView, offsetState: OffsetState): number;

/**
 * Writes an OSC int64 ("h") value.
 *
 * @param val the number to write
 * @param [dv] a DataView instance to write the number into
 * @param [offset] an offset into dv
 */
export function writeInt64(val: number, dv?: DataView, offset?: number): Uint8Array;

/**
 * Reads an OSC float32 ("f") value.
 *
 * @param dv a DataView containing the raw bytes
 * @param offsetState an offsetState object used to store the current offset index into dv
 * @return the number that was read
 */
export function readFloat32(dv: DataView, offsetState: OffsetState): number;

/**
 * Writes an OSC float32 ("f") value.
 *
 * @param val the number to write
 * @param dv a DataView instance to write the number into
 * @param offset an offset into dv
 */
export function writeFloat32(val: number, dv?: DataView, offset?: number): Uint8Array;

/**
 * Reads an OSC float64 ("d") value.
 *
 * @param dv a DataView containing the raw bytes
 * @param offsetState an offsetState object used to store the current offset index into dv
 * @return the number that was read
 */
export function readFloat64(dv: DataView, offsetState: OffsetState): number;

/**
 * Writes an OSC float64 ("d") value.
 *
 * @param val the number to write
 * @param dv a DataView instance to write the number into
 * @param offset an offset into dv
 */
export function writeFloat64(val: number, dv?: DataView, offset?: number): Uint8Array;

/**
 * Reads an OSC 32-bit ASCII character ("c") value.
 *
 * @param dv a DataView containing the raw bytes
 * @param offsetState an offsetState object used to store the current offset index into dv
 * @return a string containing the read character
 */
export function readChar32(dv: DataView, offsetState: OffsetState): string;

/**
 * Writes an OSC 32-bit ASCII character ("c") value.
 *
 * @param str the string from which the first character will be written
 * @param dv a DataView instance to write the character into
 * @param offset an offset into dv
 */
export function writeChar32(str: string, dv?: DataView, offset?: number): Uint8Array;

/**
 * Reads an OSC blob ("b") (i.e. a Uint8Array).
 *
 * @param dv a DataView instance to read from
 * @param offsetState an offsetState object used to store the current offset index into dv
 * @return the data that was read
 */
export function readBlob(dv: DataView, offsetState: OffsetState): Uint8Array;

/**
 * Writes a raw collection of bytes to a new ArrayBuffer.
 *
 * @todo Array-Like?
 *
 * @param {Array-like} data a collection of octets
 * @return a buffer containing the OSC-formatted blob
 */
export function writeBlob(data: any): Uint8Array;

/**
 * Reads an OSC 4-byte MIDI message.
 *
 * @param dv the DataView instance to read from
 * @param offsetState an offsetState object used to store the current offset index into dv
 * @return an array containing (in order) the port ID, status, data1 and data1 bytes
 */
export function readMIDIBytes(dv: DataView, offsetState: OffsetState): Uint8Array;

/**
 * Writes an OSC 4-byte MIDI message.
 *
 * @param {Array-like} bytes a 4-element array consisting of the port ID, status, data1 and data1 bytes
 * @return the written message
 */
export function writeMIDIBytes(bytes: any): Uint8Array;

/**
 * Reads an OSC RGBA colour value.
 *
 * @param dv the DataView instance to read from
 * @param offsetState an offsetState object used to store the current offset index into dv
 * @return a colour object containing r, g, b, and a properties
 */
export function readColor(dv: DataView, offsetState: OffsetState): RGBAColour;

/**
 * Writes an OSC RGBA colour value.
 *
 * @param color a colour object containing r, g, b, and a properties
 * @return a byte array containing the written color
 */
export function writeColor(color: RGBAColour): Uint8Array;

/**
 * Reads an OSC true ("T") value by directly returning the JavaScript Boolean "true".
 */
export function readTrue(): true;

/**
 * Reads an OSC false ("F") value by directly returning the JavaScript Boolean "false".
 */
export function readFalse(): false;

/**
 * Reads an OSC nil ("N") value by directly returning the JavaScript "null" value.
 */
export function readNull(): null;

/**
 * Reads an OSC impulse/bang/infinitum ("I") value by directly returning 1.0.
 */
export function readImpulse(): number;

/**
 * Reads an OSC time tag ("t").
 *
 * @param dv the DataView instance to read from
 * @param offsetState an offset state object containing the current index into dv
 * @param a time tag object containing both the raw NTP as well as the converted native (i.e. JS/UNIX) time
 */
export function readTimeTag(dv: DataView, offsetState: OffsetState): TimeTag;

/**
 * Writes an OSC time tag ("t").
 *
 * Takes, as its argument, a time tag object containing either a "raw" or "native property."
 * The raw timestamp must conform to the NTP standard representation, consisting of two unsigned int32
 * values. The first represents the number of seconds since January 1, 1900; the second, fractions of a second.
 * "Native" JavaScript timestamps are specified as a number representing milliseconds since January 1, 1970.
 *
 * @todo should timeTag be Partial<TimeTag>
 *
 * @param timeTag time tag object containing either a native JS timestamp (in ms) or a NTP timestamp pair
 * @return {Uint8Array} raw bytes for the written time tag
 */
export function writeTimeTag(timeTag: TimeTag): Uint8Array;

/**
 * Produces a time tag containing a raw NTP timestamp
 * relative to now by the specified number of seconds.
 *
 * @param secs the number of seconds relative to now (i.e. + for the future, - for the past)
 * @param now the number of milliseconds since epoch to use as the current time. Defaults to Date.now()
 * @return the time tag
 */
export function timeTag(secs: number, now: number): TimeTag;

/**
 * Converts OSC's standard time tag representation (which is the NTP format)
 * into the JavaScript/UNIX format in milliseconds.
 *
 * @param secs1900 the number of seconds since 1900
 * @param frac the number of fractions of a second (between 0 and 2^32)
 * @return a JavaScript-compatible timestamp in milliseconds
 */
export function ntpToJSTime(secs1900: number, frac: number): number;

// TODO: is this non-API?
// export function jsToNTPTime(jsTime: Date): [number, number];

/**
 * Reads the argument portion of an OSC message.
 *
 * @todo return type check
 *
 * @param dv a DataView instance to read from
 * @param options read options
 * @param offsetState the offsetState object that stores the current offset into dv
 * @return an array of the OSC arguments that were read
 */
export function readArguments(dv: DataView, options?: Options, offsetState?: OffsetState): any[];

/**
 * Writes the specified arguments.
 *
 * @todo type check args
 *
 * @param args an array of arguments
 * @param options options for writing
 * @return a buffer containing the OSC-formatted argument type tag and values
 */
export function writeArguments(args: any[], options?: Options): Uint8Array;

// TODO: is this non-API?
// export function writeArrayArguments(args: any, dataCollection: any): any;

// TODO: is this non-API?
// export function writeArgument(arg: any, dataCollection: any): any;

/**
 * Reads an OSC message.
 *
 * @todo data is array-like
 * @todo return object of { address, any | any[] }
 *
 * @param {Array-like} data an array of bytes to read from
 * @param options read options
 * @param offsetState an offsetState object that stores the current offset into dv
 * @return the OSC message, formatted as a JavaScript object containing "address" and "args" properties
 */
export function readMessage(data: any, options?: Options, offsetState?: OffsetState): Message;

/**
 * Writes an OSC message.
 *
 * @param msg a message object containing "address" and "args" properties
 * @param options write options
 * @return an array of bytes containing the OSC message
 */
export function writeMessage(msg: Message, options?: Options): Uint8Array;

// TODO: is this non-API?
// export function isValidMessage(msg: Message): boolean;

/**
 * Reads an OSC bundle.
 *
 * @todo should make use of Packet type?
 *
 * @param dv the DataView instance to read from
 * @param options read optoins
 * @param offsetState an offsetState object that stores the current offset into dv
 * @return the bundle or message object that was read
 */
export function readBundle(dv: DataView, options?: Options, offsetState?: OffsetState): Packet;

/**
 * Writes an OSC bundle.
 *
 * @param bundle object containing "timeTag" and "packets" properties
 * @param options write options
 * @return {Uint8Array} an array of bytes containing the message
 */
export function writeBundle(bundle: Bundle, options?: Options): Uint8Array;

// TODO: is this non-API?
// export function isValidBundle(bundle: Bundle): boolean;

/**
 * Reads an OSC packet, which may consist of either a bundle or a message.
 *
 * @todo data is array-like
 * @todo make use of Packet type for return value?
 *
 * @param {Array-like} data an array of bytes to read from
 * @param options read options
 * @param offsetState an offsetState object that stores the current offset into dv
 * @return a bundle or message object
 */
export function readPacket(data: any[], options?: Options, offsetState?: OffsetState, len?: number): Packet;

/**
 * Writes an OSC packet, which may consist of either of a bundle or a message.
 *
 * @param packet the OSC Packet to be written
 * @param options write options
 * @return an array of bytes containing the message
 */
export function writePacket(packet: Packet, options?: Options): Uint8Array;

export class Port extends EventEmitter {
    constructor(options: Options);

    // TODO: data is array-like
    decodeOSC(data: any[], packetInfo: any): void;

    encodeOSC(packet: Packet): Uint8Array;

    send(oscPacket: Packet, ...args: any[]): void;

    on(event: 'ready', cb: () => void): this;
    on(event: 'message', cb: (message: Message, timeTag: TimeTag, info: any) => void): this;
    on(event: 'bundle', cb: (bundle: Bundle, timeTag: TimeTag, info: any) => void): this;
    on(event: 'osc', cb: (packet: Packet, info: any) => void): this;
    on(event: 'raw', cb: (data: Uint8Array, info: any) => void): this;
    on(event: 'error', cb: (error: Error) => void): this;
}

export class SLIPPort extends Port {
    constructor(options: object);

    decodeSLIPData(data: any, packetInfo: any): void;

    // encodeOSC(packet: Packet): Uint8Array;
}

/**
 * A Relay connects two sources of OSC data together,
 * relaying all OSC messages received by each port to the other.
 */
export class Relay extends EventEmitter {
    /**
     * @param port1 the first port to relay
     * @param port2 the second port to relay
     * @param options the configuration options for this relay
     */
    constructor(port1: Port, port2: Port, options: object);

    close(): void;

    listen(): void;

    open(): void;

    on(event: 'close', cb: (port1: Port, port2: Port) => void): this;
}

export class UDPPort extends Port {
    constructor(options: object);

    close(): void;

    listen(): void;

    open(): void;

    sendRaw(encoded: any, address: any, port: any): void;

    static setupMulticast(that: UDPPort): void;

    // on(event: 'open', cb: (port1: Port, port2: Port) => void): this;
    // on(event: 'close', cb: (port1: Port, port2: Port) => void): this;
}

export interface TCPSocketPortOptions {
    address?: string;
    localAddress?: string;
    port?: number;
    localPort?: number;
    socket?: Socket;
}

export class TCPSocketPort extends SLIPPort {
    constructor(options: TCPSocketPortOptions);

    close(): void;

    listen(): void;

    open(address: any, port: any): void;

    sendRaw(encoded: any): void;
}

export class SerialPort extends SLIPPort {
    constructor(options: object);

    close(): void;

    listen(): void;

    open(): void;

    sendRaw(encoded: any): void;
}

export class WebSocketPort extends Port {
    constructor(options: object);

    close(code: any, reason: any): void;

    listen(): void;

    open(): void;

    sendRaw(encoded: any): void;

    static setupSocketForBinary(socket: WebSocket): void;
}

/*
 * Internal (osc.js)
 */

// export const isCommonJS: boolean;
// export const isElectron: boolean;
// export const isNode: boolean;
// export const isBufferEnv: boolean;

// export function isArray(obj: any): any;
// export function isTypedArrayView(obj: any): any;
// export function isBuffer(obj: any): any;

// export namespace Long;
// export namespace TextDecoder;
// export namespace TextEncoder;

// export function dataView(obj: any, offset: any, length: any): any;
// export function byteArray(obj: any): any;
// export function nativeBuffer(obj: any): any;
// export function copyByteArray(source: any, target: any, offset: any): any;

// export namespace readString {
//     // TODO: are charCodes actually UInt8Array?
//     function raw(charCodes: Uint8Array): string;
//     // TODO: are charCodes actually UInt8Array?
//     function withBuffer(charCodes: Uint8Array): string;
//     // TODO: are charCodes actually UInt8Array?
//     function withTextDecoder(charCodes: Uint8Array): string;
// }

// export namespace writeString {
//     // TODO: is this correct?
//     function withBuffer(str: string): Buffer;
//     function withTextEncoder(str: string): Uint8Array;
// }

// export function readPrimitive(dv: any, readerName: any, numBytes: any, offsetState: any): any;
// export function writePrimitive(val: any, dv: any, writerName: any, numBytes: any, offset: any): any;

// export function readArgument(argType: any, typeTagString: any, dv: DataView, options: any, offsetState: OffsetState): { type: any; value: any };
// export function readArgumentsIntoArray(arr: any[], argTypes: any[], typeTagString: any, dv: DataView, options: any, offsetState: OffsetState): any[];

// export function joinParts(dataCollection: any): Uint8Array;
// export function addDataPart(dataPart: any, dataCollection: any): void;
// export function collectArguments(args: any, options: any, dataCollection: any): any;

// export function readMessageContents(address: any, dv: DataView, options: any, offsetState: OffsetState): object;
// export function collectMessageParts(msg: any, options: any, dataCollection: any): any;

// export function collectBundlePackets(bundle: Bundle, options: any, dataCollection: any): any;
// export function readBundleContents(dv: DataView, options: object, offsetState: OffsetState, len: number): object;

// export const argumentTypes: {
//     F: {
//         reader: string;
//     };
//     I: {
//         reader: string;
//     };
//     N: {
//         reader: string;
//     };
//     S: {
//         reader: string;
//         writer: string;
//     };
//     T: {
//         reader: string;
//     };
//     b: {
//         reader: string;
//         writer: string;
//     };
//     c: {
//         reader: string;
//         writer: string;
//     };
//     d: {
//         reader: string;
//         writer: string;
//     };
//     f: {
//         reader: string;
//         writer: string;
//     };
//     h: {
//         reader: string;
//         writer: string;
//     };
//     i: {
//         reader: string;
//         writer: string;
//     };
//     m: {
//         reader: string;
//         writer: string;
//     };
//     r: {
//         reader: string;
//         writer: string;
//     };
//     s: {
//         reader: string;
//         writer: string;
//     };
//     t: {
//         reader: string;
//         writer: string;
//     };
// };

// export function inferTypeForArgument(arg: any): string;
// export function annotateArguments(args: any[]): any;

/*
 * Internal (osc-transports.js)
 */

// export const supportsSerial: boolean;

// export function firePacketEvents(port: any, packet: any, timeTag: any, packetInfo: any): void;
// export function fireBundleEvents(port: any, bundle: any, timeTag: any, packetInfo: any): void;

// export function relay(from: any, to: any, eventName: any, sendFnName: any, transformFn: any, sendArgs: any): any;
// export function relayPorts(from: any, to: any, o: any): any;
// export function stopRelaying(from: any, relaySpec: any): void;

// export function fireClosedPortSendError(port: any, msg: any): void;
