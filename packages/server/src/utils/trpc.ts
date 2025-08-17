import { TRPCError } from '@trpc/server';

export class ExtendedTRPCError extends TRPCError {
    customCode?: CustomErrorCodes;
    httpCode?: number;
    constructor(code: CustomErrorCodes | TRPCError["code"], message: string, cause?: unknown ) {
        if (code in ErrorCodeMapping) {
          const customCode = ErrorCodeMapping[code as CustomErrorCodes];
          super({code: customCode.trpcCode, message, cause});
          this.customCode = code as CustomErrorCodes;
          this.httpCode = customCode.httpCode;
        } else {
          super({code: code as TRPCError["code"], message, cause});
        }
        console.error(`[tRPC Error] ${code}: ${message}`, cause);
    }
}

type CustomErrorCodes = keyof typeof ErrorCodeMapping;

export const ErrorCodeMapping = {
    OK: {
      trpcCode: "INTERNAL_SERVER_ERROR",
      httpCode: 200
    },
    CREATED: {
      trpcCode: "INTERNAL_SERVER_ERROR",
      httpCode: 201
    },
    NO_CONTENT: {
      trpcCode: "INTERNAL_SERVER_ERROR",
      httpCode: 204
    }
} as const satisfies Record<string, {trpcCode: TRPCError["code"], httpCode: number}>;