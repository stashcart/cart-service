import { ApiHeader } from '@nestjs/swagger';
import { ON_BEHALF_OF } from '../on-behalf-of.decorator';

export const ApiOnBehalfOf = () => ApiHeader({ name: ON_BEHALF_OF });
