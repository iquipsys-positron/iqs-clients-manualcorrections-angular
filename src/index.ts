/// <reference path="../typings/tsd.d.ts" />
class PositronManualCorrectionsAppController implements ng.IController {
    public $onInit() { }
    public isChrome: boolean;

    constructor(
        $rootScope: ng.IRootScopeService,
        $state: ng.ui.IStateService,
        pipSystemInfo: pip.services.ISystemInfo,
    ) {
        "ngInject";

        this.isChrome = pipSystemInfo.browserName == 'chrome' && pipSystemInfo.os == 'windows';
    }
}

angular
    .module('iqsPositronManualCorrectionsApp', [
        'iqsPositronManualCorrections.Config',
        'iqsPositronManualCorrections.Templates',
        'iqsOrganizations.Service',
        'iqsManualCorrections'
    ])
    .controller('iqsPositronManualCorrectionsAppController', PositronManualCorrectionsAppController);


