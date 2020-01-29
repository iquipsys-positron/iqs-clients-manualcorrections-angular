
{
    function declareGlobalIquipsysResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            CANCEL: 'Cancel',
            DELETE: 'Delete',
            SAVE: 'Save',
            EDIT: 'Edit',
            OK: 'Ok',
            ADD: 'Add',
            CONFIG: 'Configure',
            CONFIRM_DELETE: 'Delete',
            CONFIRM_CANCEL: 'Cancel',
            free: 'free',

            other: 'other',
            CATEGORY: 'Category',
            PHONE: 'Phone',
            PIN: 'Pin',
            OBJECT_TAB_STATUS: 'Status', //: 'Details',
            'Change avatar': 'Change avatar',
            'User settings': 'User settings',
            'Sign out': 'Sign out',

            MAP_STATUS_OBJECT_DANGER: 'in danger',
            MAP_STATUS_OBJECT_IMMOBILITY: 'immobility',
            MAP_STATUS_OBJECT_FREEZED: 'freezed',
            MAP_STATUS_OBJECT_ONLINE: 'online',
            ACTION_SEND_SIGNAL: 'Send signal',
            ERROR_DISMISS: 'Close',
            DETAILS: 'Details'

        });
        pipTranslateProvider.translations('ru', {
            CANCEL: 'Отменить',
            DELETE: 'Удалить',
            SAVE: 'Сохранить',
            EDIT: 'Изменить',
            OK: 'Подтвердить',
            ADD: 'Добавить',
            CONFIG: 'Настроить',
            CONFIRM_DELETE: 'Удалить',
            CONFIRM_CANCEL: 'Отменить',
            free: 'свободен',

            other: 'неопределенные',
            CATEGORY: 'Категория',
            PHONE: 'Телефон',
            PIN: 'Пин код',
            OBJECT_TAB_STATUS: 'Статус', //Details: 'Подробно',
            'Change avatar': "Изменить аватар",
            'User settings': 'Настройки пользователя',
            'Sign out': 'Выйти',

            MAP_STATUS_OBJECT_DANGER: 'в опасности',
            MAP_STATUS_OBJECT_IMMOBILITY: 'неподвижный',
            MAP_STATUS_OBJECT_FREEZED: 'полностью неподвижный',
            MAP_STATUS_OBJECT_ONLINE: 'на связи',
            ACTION_SEND_SIGNAL: 'Послать сигнал',
            ERROR_DISMISS: 'Закрыть',
            DETAILS: 'Подробности'

        });
    }

    angular
        .module('iqsPositronManualCorrectionsApp')
        .config(declareGlobalIquipsysResources);
}
