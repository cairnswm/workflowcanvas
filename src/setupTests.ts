import '@testing-library/jest-dom'

class MockTextEncoder implements TextEncoder {
  encoding = 'utf-8'
  encode(input: string): Uint8Array {
    return new Uint8Array(Buffer.from(input))
  }
  encodeInto(source: string, destination: Uint8Array): TextEncoderEncodeIntoResult {
    const encoded = this.encode(source)
    destination.set(encoded)
    return { read: source.length, written: encoded.length }
  }
}

class MockTextDecoder implements TextDecoder {
  encoding = 'utf-8'
  fatal = false
  ignoreBOM = false
  decode(input?: BufferSource): string {
    if (!input) return ''
    return Buffer.from(input as Uint8Array).toString()
  }
}

globalThis.TextEncoder = MockTextEncoder as unknown as typeof TextEncoder
globalThis.TextDecoder = MockTextDecoder as unknown as typeof TextDecoder
