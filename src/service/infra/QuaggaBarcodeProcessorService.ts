import QuaggaBarcodeProcessor from '../../infra/QuaggaBarcodeProcessor';
import Quagga from '@ericblade/quagga2';


export const QuaggaBarcodeProcessorService = (): BarcodeProcessor => new QuaggaBarcodeProcessor(Quagga)