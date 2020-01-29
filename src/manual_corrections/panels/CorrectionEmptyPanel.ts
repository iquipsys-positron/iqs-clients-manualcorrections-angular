interface ICorrectionEmptyPanelBindings {
    [key: string]: any;

    onCorrectionlAdd: any;
    state: any;
    ngDisabled: any;
    section: any;
    isPreLoading: any;
}

const CorrectionEmptyPanelBindings: ICorrectionEmptyPanelBindings = {
    // change operational event
    onCorrectionlAdd: '&iqsAdd',
    state: '<?iqsState',
    ngDisabled: '&?',
    section: '<?iqsSection',
    isPreLoading: '<?iqsPreLoading'
}

class CorrectionEmptyPanelChanges implements ng.IOnChangesObject, ICorrectionEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onCorrectionlAdd: ng.IChangesObject<() => ng.IPromise<void>>;
    state: ng.IChangesObject<string>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
    section: ng.IChangesObject<number>;
    isPreLoading: ng.IChangesObject<boolean>;
}

class CorrectionEmptyPanelController implements ng.IController {
    public $onInit() { }
    public onCorrectionlAdd: () => void;
    public ngDisabled: () => boolean;
    public state: string;
    public section: number;
    public isPreLoading: boolean;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService
    ) {
        $element.addClass('iqs-correction-empty-panel');

    }

    public onAdd(): void {
        if (this.onCorrectionlAdd) {
            this.onCorrectionlAdd();
        }
    }
}

(() => {
    angular
        .module('iqsCorrectionEmptyPanel', [])
        .component('iqsCorrectionEmptyPanel', {
            bindings: CorrectionEmptyPanelBindings,
            templateUrl: 'manual_corrections/panels/CorrectionEmptyPanel.html',
            controller: CorrectionEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
