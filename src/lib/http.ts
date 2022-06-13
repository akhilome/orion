type ObjectData = Record<string, string> | Record<string, unknown>;
type Data =
  | null
  | ObjectData
  | Record<string, ObjectData>
  | ObjectData[]
  | Record<string, ObjectData>[];

interface Meta {
  paging?: Paging | null;
}

interface Paging {
  current: number;
  size: number;
  total: number;
}

interface Error {
  message: string;
  field?: string;
}

/**
 * final response object interface
 * interface ResponseObject {
 *   success: boolean;
 *   message: string;
 *   data: Data | null;
 *   meta: Meta | null;
 *   errors: Error[] | null;
 * }
 */

abstract class BaseResponseObject {
  constructor(
    public success: boolean,
    public message: string,
    public data: Data,
    public meta?: Meta | null,
    public errors?: Error[] | null,
  ) {
    this.meta = this.meta || null;
    this.errors = this.errors || null;
  }
}

export class SuccessResponseObject extends BaseResponseObject {
  constructor(public message: string, public data: Data = null) {
    super(true, message, data);
  }
}

export class PaginatedSuccessResponseObject extends BaseResponseObject {
  constructor(message: string, data: Data = null, paging: Paging) {
    const meta: Meta = { paging };
    super(true, message, data, meta);
  }
}

export class ErrorResponseObject extends BaseResponseObject {
  constructor(public message: string, public errors: Error[] = []) {
    super(false, message, null, null, errors);
  }
}
