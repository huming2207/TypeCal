import { BaseComponent } from './Component';
import { inheritSerialization } from 'cerialize';

@inheritSerialization(BaseComponent)
export class JournalComponent extends BaseComponent {}
