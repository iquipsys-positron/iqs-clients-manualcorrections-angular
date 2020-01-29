import './CorrectionsModel';
import './CorrectionHistoryViewModel';
import './CorrectionsViewModel';

let m: any;

try {
    m = angular.module('iqsCorrections');
    m.requires.push(...[
        'iqsCorrections.ViewModel',
        'iqsCorrectionsHistory.ViewModel'
    ]);
} catch (err) { }

export * from './ICorrectionsViewModel';
