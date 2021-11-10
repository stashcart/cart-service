import { ApiHeader } from '@nestjs/swagger';
import { X_USER_ID } from '../user-id.decorator';

export const ApiUserId = () => ApiHeader({ name: X_USER_ID });
