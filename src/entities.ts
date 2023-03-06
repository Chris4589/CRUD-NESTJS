import { Auth } from './auth/entities/auth.entity';
import { Book } from './book/entities/book.entity';
import { Audit } from './audit/entities/audit.entity';

export const entities = [].concat(Auth).concat(Book).concat(Audit);
