
{
    function declareNewManualCorrectionsTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {

            MANUAL_CORRECTIONS: 'Manual corrections',

            MANUAL_CORRECTIONS_REQUESTED: 'Requested',
            MANUAL_CORRECTIONS_APPROVED: 'Approved',
            MANUAL_CORRECTIONS_REJECTED: 'Rejected',

            MANUAL_CORRECTIONS_REQUEST: 'Requests',
            MANUAL_CORRECTIONS_HISTORY: 'History',

            MANUAL_CORRECTIONS_EMPTY_TITLE: 'All manual correction requests have been processed!',
            MANUAL_CORRECTIONS_EMPTY_ADD_BUTTON: 'Add manual correction',
            MANUAL_CORRECTIONS_LOADING_TITLE: 'Manual corrections loading',
            MANUAL_CORRECTIONS_ACCEPT: 'Approve',
            MANUAL_CORRECTIONS_CORRECTION: 'Edit',
            MANUAL_CORRECTIONS_REJECT: 'Reject',
            MANUAL_CORRECTIONS_UNDO: 'Undo',

            CORRECTION_NEW_TITLE: 'New manual correction',
            CORRECTION_EDIT_TITLE: 'Edit manual correction',
            CORRECTION_OBJECT_GROUP_LABEL: 'Object or group',
            CORRECTION_OBJECT_GROUP_PLACEHOLDER: 'Choose object or group',
            CORRECTION_REASON_LABEL: 'Reason',
            CORRECTION_PARAMETRS_LABEL: 'Parameters corrections',
            CORRECTION_EVENT_LABEL: 'Events corrections',
            CORRECTION_TIME_LABEL: 'Presence in zones corrections',
            CORRECTION_DATE: 'By date',

            CORRECTION_PARAMETRS_PLACEHOLDER: 'Choose parameters',
            CORRECTION_EVENT_PLACEHOLDER: 'Choose events',
            CORRECTION_TIME_PLACEHOLDER: 'Choose zone',
            MANUAL_CORRECTIONS_SAVE: 'Save',
            MANUAL_CORRECTIONS_CANCEL: 'Cancel',

            CORRECTIONS_DELETE_CONFIRMATION_TITLE: 'Откатить коррекцию',

            CORRECTIONS_CORRECTION_NAME: 'Name',
            CORRECTIONS_CORRECTED_VALUE: 'Corrected value',
            CORRECTIONS_ACTUAL_VALUE: 'Actual value',
            FILTER_PARAMS_DISTANCE: 'Distance traveled',
            FILTER_PARAMS_ONLINE: 'Presence',
            FILTER_PARAMS_OFFLINE: 'Time of absence',
            FILTER_PARAMS_FREEZED: 'Freezed',
            FILTER_PARAMS_IMMOBILE: 'Immobility',
            FILTER_PARAMS_SPEED: 'Average speed',
            FILTER_PARAMS_EMERGENCY: 'Emergency',
        });

        pipTranslateProvider.translations('ru', {

            MANUAL_CORRECTIONS: 'Ручные коррекции',

            MANUAL_CORRECTIONS_REQUESTED: 'Запрошенный',
            MANUAL_CORRECTIONS_APPROVED: 'Принятый',
            MANUAL_CORRECTIONS_REJECTED: 'Отклоненный',

            MANUAL_CORRECTIONS_REQUEST: 'Запросы',
            MANUAL_CORRECTIONS_HISTORY: 'История',

            MANUAL_CORRECTIONS_EMPTY_TITLE: 'Все запросы на коррекцию статистик обработаны!',
            MANUAL_CORRECTIONS_EMPTY_ADD_BUTTON: 'Добавить коррекцию',
            MANUAL_CORRECTIONS_LOADING_TITLE: 'Загружаются коррекции',
            MANUAL_CORRECTIONS_ACCEPT: 'Принять',
            MANUAL_CORRECTIONS_CORRECTION: 'Изменить',
            MANUAL_CORRECTIONS_REJECT: 'Отказать',
            MANUAL_CORRECTIONS_UNDO: 'Откатить',



            CORRECTION_NEW_TITLE: 'Новая коррекция',
            CORRECTION_EDIT_TITLE: 'Изменение коррекции',
            CORRECTION_OBJECT_GROUP_LABEL: 'Объект или группа',
            CORRECTION_OBJECT_GROUP_PLACEHOLDER: 'Выберите объект или группу',
            CORRECTION_REASON_LABEL: 'Причина',
            CORRECTION_PARAMETRS_LABEL: 'Коррекция параметров',
            CORRECTION_EVENT_LABEL: 'Коррекция событий',
            CORRECTION_TIME_LABEL: 'Коррекция времени пребывания в зонах',
            CORRECTION_DATE: 'За дату',

            CORRECTION_PARAMETRS_PLACEHOLDER: 'Выберите параметр',
            CORRECTION_EVENT_PLACEHOLDER: 'Выберите событие',
            CORRECTION_TIME_PLACEHOLDER: 'Выберите зону',
            MANUAL_CORRECTIONS_SAVE: 'Принять',
            MANUAL_CORRECTIONS_CANCEL: 'Отменить',

            CORRECTIONS_DELETE_CONFIRMATION_TITLE: 'Откатить коррекцию',

            CORRECTIONS_CORRECTION_NAME: 'Имя',
            CORRECTIONS_CORRECTED_VALUE: 'Скорректированное значение',
            CORRECTIONS_ACTUAL_VALUE: 'Действительное значение',
            FILTER_PARAMS_DISTANCE: 'Пройденное расстояние',
            FILTER_PARAMS_ONLINE: 'Время пребывания',
            FILTER_PARAMS_OFFLINE: 'Время отсутствия',
            FILTER_PARAMS_FREEZED: 'Время полной неподвижности',
            FILTER_PARAMS_IMMOBILE: 'Время неподвижности',
            FILTER_PARAMS_SPEED: 'Средняя скорость',
            FILTER_PARAMS_EMERGENCY: 'Аварийное состояние',
        });
    }

    angular
        .module('iqsManualCorrections')
        .config(declareNewManualCorrectionsTranslateResources);
}
