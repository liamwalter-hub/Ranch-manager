import packText from '../../content/montana/pack.yaml?raw';
import { parsePack } from './parse';

export const montanaPack = parsePack(packText, 'content/montana/pack.yaml');
