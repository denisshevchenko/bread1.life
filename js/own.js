$(document).ready(function(){
    // Remember what language was used before...
    const storedLanguage = getLanguage();
    storedLanguage ? setLanguage(storedLanguage) : setLanguage('en')
    // Initialize modal dialogs. 
    $('.modal').modal();
    // Clean up all inputs, just in case...
    $("#aForm").trigger("reset");
    // We assume that user wants to input the food name by default, not the carbs value.
    $("#food_name").focus();
    // Autocomplete for Russian.
    $("#food_name").autocomplete({
        data: {
            "Белый хлеб": null,
            "Банан": null // 'https://placehold.it/250x250'
        },
    });
    
    // In the beginning input for amount are disabled.
    resetInput("#in_gramms");
    resetInput("#in_bunits");
    
    checkIfUserIsDefiningFood('#food_name');
    checkIfUserIsDefiningFood('#carbs');

    $('#in_gramms').on('input',function(e){
        if( $('#in_gramms').val() ) {
            $("#in_bunits").val( $('#in_gramms').val() );
        } else {
            // If one there's no gramms - there's no bunits as well.
            cleanInput("#in_bunits");
        }
    });

    $('#in_bunits').on('input',function(e){
        if( $('#in_bunits').val() ) {
            $("#in_gramms").val( $('#in_bunits').val() );
        } else {
            // If one there's no bunits - there's no gramms as well.
            cleanInput("#in_gramms");
        }
    });

    // Allow to input numbers only (both from keyboard and from clipboard).
    $('#carbs').keyup(validateNumber);
    $('#carbs').focusout(validateNumber);

    $('#in_bunits').keyup(validateNumber);
    $('#in_bunits').focusout(validateNumber);

    $('#in_gramms').keyup(validateNumber);
    $('#in_gramms').focusout(validateNumber);

    // Calculate...
});

function checkIfUserIsDefiningFood(anId) {
    $(anId).on('input',function(e){
        if( $.trim( $(anId).val() ) == '' ) {
            resetInput("#in_gramms");
            resetInput("#in_bunits");
        } else {
            enableInput("#in_gramms");
            enableInput("#in_bunits");
        } 
    });
}

function validateNumber() {
    this.value = this.value.replace(/[^0-9\.,]/g,'');
}

function enableInput(anId) {
    $(anId).prop('disabled', false);
}

function cleanInput(anId) {
    $(anId).val('');
}

function resetInput(anId) {
    $(anId).prop('disabled', true);
    cleanInput(anId);
}

function getLanguage() {
    return localStorage.getItem('language');
}

var translate = function (jsdata){
    $("[data-tkey]").each (function (index) {
        const localizedStr = jsdata[$(this).attr ('data-tkey')];
        $(this).html(localizedStr);
    });
}

const enText = {
    "pageTitle":            "Bread Unit",
    "breadUnitTitle":       "Bread Unit",
    "whatIsItButton":       "What is it?",
    "agree":                "I see",
    "foodName":             "Food name", 
    "foodNameHelper":       "Start type a name...", 
    "or":                   "or",
    "carbs":                "Carbohydrates/100 g",
    "carbsHelper":          "Input a number from 0 to 100",
    "gramms":               "Grams",
    "grammsHelper":         "How many grams",
    "bunits":               "BU",
    "bunitsHelper":         "How many bread units",
    "me":                   "Denis Shevchenko",
    "whatIsIt":             "What is it",
    "whatIsItDetails":      "Bread units (BU) calculator, converts BU in grams and vice versa.",
    "howToUseIt":           "How to use it",
    "howToUseItDetails":    "",
    "disclaimer":           "Attention!",
    "disclaimerDetails":    "I'm happy .",
    "oss":                  "Free software",
    "ossDetails":           "Bread Unit is a free software, its source code is available on <a href=\"https://github.com/denisshevchenko/bread1.life\">GitHub</a>."
}

const ruText = {
    "pageTitle":            "Хлебная Единица",
    "breadUnitTitle":       "Хлебная Единица",
    "whatIsItButton":       "Что это?",
    "agree":                "Понятно",
    "foodName":             "Название продукта", 
    "foodNameHelper":       "Начните печатать название...", 
    "or":                   "или",
    "carbs":                "Углеводы на 100 г",
    "carbsHelper":          "Введите значение от 0 до 100",
    "gramms":               "Граммы",
    "grammsHelper":         "Количество в граммах", 
    "bunits":               "ХЕ",
    "bunitsHelper":         "Количество в хлебных единицах",
    "me":                   "Денис Шевченко",
    "whatIsIt":             "Что это",
    "whatIsItDetails":      "Калькулятор хлебных единиц (ХЕ) для диабетиков, переводит ХЕ в граммы и наоборот.",
    "howToUseIt":           "Как им пользоваться",
    "howToUseItDetails":    "Выберите продукт в поле «Название продукта», начните печатать и вам будут предложены соответствующие варианты. Если среди них нет вашего продукта, в поле «Углеводы» введите количество углеводов на 100 г продукта. Затем укажите количество: если введёте в граммах, увидите рассчитанное количество в ХЕ, если же введёте в ХЕ, калькулятор рассчитает количество в граммах.",
    "disclaimer":           "Внимание!",
    "disclaimerDetails":    "Я очень рад, что мой калькулятор помогает людям, живущим с сахарным диабетом. Однако я не эндокринолог, и этот калькулятор не может рассматриваться как медицинское руководство по питанию для диабетиков. Если вам нужна медицинская консультация — пожалуйста, обратитесь к специалисту.",
    "oss":                  "Свободная программа",
    "ossDetails":           "Хлебная Единица — свободное программное обеспечение с открытым исходным кодом, доступным на <a href=\"https://github.com/denisshevchenko/bread1.life\">GitHub</a>."
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    if (lang == 'ru') {
        translate(ruText);
    } else {
        translate(enText);
    }
}
