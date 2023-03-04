import { HttpException, HttpStatus } from '@nestjs/common';

export class NotContentException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NO_CONTENT);
  }
}
