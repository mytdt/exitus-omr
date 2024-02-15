import fs from 'fs';
import PaperSheetProcessor from './data/PaperSheetProcessor';
import { PaperSheetProcessorService } from './service/data/PaperSheetProcessorService';

const paperSheetTemplate: PaperSheetTemplate = JSON.parse(fs.readFileSync('./template.json', { encoding: 'utf8' }));

const PaperSheet = PaperSheetProcessorService(paperSheetTemplate);

console.log(PaperSheet.processCurrentSheet('./assets/img.jpg'))


