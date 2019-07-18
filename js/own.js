// Create complete information about the food.
const food = createFood();
// 1 BU is amount of food that contains 10-12 grams of digestible carbohydrates,
// let's take 11.0 for now.
const gramsIn1BU = 11.0;
// Global state for the current language.
var currentLanguage = "";
// Global state for the current carbs value (carbs/100g) for calculation.
var currentCarbsIn100g = 0;

$(document).ready(function(){
    // Remember what language was used before...
    currentLanguage = localStorage.getItem("BU_language");
    if (!currentLanguage) {
        currentLanguage = "en";
    }
    setLanguage(currentLanguage);
    // Initialize modal dialogs.
    $(".modal").modal();
    // In the beginning inputs for amount are disabled.
    cleanNDisableAmountInputs();

    checkIfUserIsDefiningFood("#food_name");
    checkIfUserIsDefiningFood("#carbs");

    // Make sure user inputs numbers only...
    validateNumberIn("#carbs");
    validateNumberIn("#in_gramms");
    validateNumberIn("#in_bunits");

    // It should be from 0 to 100.
    checkIfCarbsValueIsValid();

    // It should exist in a list (corresponding to current language).
    checkIfFoodNameIsValid();

    calculateFoodAmount();
});

// Clearable input for food name.
function tog(v){ return v ? "addClass" : "removeClass"; }
    $(document).on("input", ".clearable", function(){
    $(this)[tog(this.value)]("x");
}).on("mousemove", ".x", function( e ){
    $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]("onX");
}).on("touchstart click", ".onX", function( ev ){
    ev.preventDefault();
    $(this).removeClass("x onX").val("").change();
    // Reset amount inputs as well...
    cleanNDisableAmountInputs();
});

function checkIfUserIsDefiningFood(anId) {
    $(anId).on("input",function(e){
        if( $.trim( $(anId).val() ) == "" ) {
            cleanNDisableAmountInputs();
        } else {
            enableAmountInputs();
        }
    });
}

function validateNumberIn(anId) {
    $(anId).keypress(function(key) {
        const itIsDigit = key.charCode >= 48 && key.charCode <= 57;
        const itIsDoubleSeparator = String.fromCharCode(key.which) == "." || String.fromCharCode(key.which) == ",";
        if (!itIsDigit && !itIsDoubleSeparator) {
            return false;
        }
    });

    $(anId).on("input",function(key) {
        const floatNumberPatt = new RegExp("^[0-9]+([.,\,]{1})?[0-9]*$");
        const itIsFloatNumber = floatNumberPatt.test($(anId).val());
        if (!itIsFloatNumber) {
            // Remove last incorrect char.
            $(anId).val( $(anId).val().slice(0,-1) );
        }
    });
}

function checkIfCarbsValueIsValid() {
    $("#carbs").on("input",function(key) {
        // If user inputed carbs value - we have to clean up food name.
        cleanInput("#food_name");
        $("#food-name-helper-id").css("color", "rgba(0,0,0,0.54)"); // From Materialize CSS.
        const carbsValue = parseFloat($("#carbs").val());
        if (carbsValue && (carbsValue < 0.0 || carbsValue > 100.0)) {
            // If carbs number is incorrect - we just remove it.
            $("#carbs-helper-id").css("color", "red");
            cleanInput("#carbs");
            cleanNDisableAmountInputs();
        } else {
            // The value is valid, remove red color from helper label.
            $("#carbs-helper-id").css("color", "rgba(0,0,0,0.54)"); // From Materialize CSS.
            // Store it for the calculation.
            currentCarbsIn100g = carbsValue;
        }
    });
}

function checkIfFoodNameIsValid() {
    $("#food_name").on("input",function(key) {
        // If user inputed food name - we have to clean up carbs value.
        cleanInput("#carbs");
        $("#carbs-helper-id").css("color", "rgba(0,0,0,0.54)"); // From Materialize CSS.
        // Check if food name is known.
        const foodName = $.trim( $("#food_name").val() );
        var nameIsValid = false;
        for (const keyFoodNames of food.keys()) {
            const name = keyFoodNames[currentLanguage];
            if (foodName && (name === foodName)) {
                nameIsValid = true;
                // Store corresponding carbs value for calculation.
                currentCarbsIn100g = food.get(keyFoodNames);
                alert(currentCarbsIn100g);
                break;
            }
        }
        if (nameIsValid) {
            $("#food-name-helper-id").html("");
        } else {
            $("#food-name-helper-id").html(foodNameIsUnknown(currentLanguage));
            $("#food-name-helper-id").css("color", "red");
            cleanNDisableAmountInputs();
        }
    });
}

function foodNameIsUnknown(lang) {
    switch(lang) {
        case "ru": return "Выберите продукт из списка";
        case "en": return "Please select a food from the list";
    }
}

function enableAmountInputs() {
    $("#in_gramms").prop("disabled", false);
    $("#in_bunits").prop("disabled", false);
    $("#arr-id").css("color", "#333");
}

function cleanInput(anId) {
    $(anId).val("");
}

function resetInput(anId) {
    $(anId).prop("disabled", true);
    cleanInput(anId);
}

function cleanNDisableAmountInputs() {
    resetInput("#in_gramms");
    resetInput("#in_bunits");
    $("#arr-id").css("color", "#bcbcbc");
}

const enText = {
      "pageTitle":            "Bread Unit"
    , "breadUnitTitle":       "Bread Unit"
    , "whatIsItButton":       "What is it?"
    , "agree":                "I see"
    , "foodName":             "Food name"
    , "foodNameHelper":       "Start type a name..."
    , "or":                   "or"
    , "carbs":                "Carbs/100 g"
    , "carbsHelper":          "Input a number from 0 to 100"
    , "gramms":               "Grams"
    , "grammsHelper":         "How many grams"
    , "bunits":               "BU"
    , "bunitsHelper":         "How many bread units"
    , "me":                   "Denis Shevchenko"
    , "whatIsIt":             "What is it"
    , "whatIsItDetails":      "Bread units (BU) calculator, converts BU in grams and vice versa."
    , "howToUseIt":           "How to use it"
    , "howToUseItDetails":    "Select a food in the «Food name», start typing and pick your food from the list. If there's no food you need, input carbohydrates value in «Carbs/100g» (the amount of carbohydrates in 100g of the meal). Then input amount of the meal: if you specify it in grams, you'll see corresponding amount in bread units, and vice versa."
    , "disclaimer":           "Attention!"
    , "disclaimerDetails":    "I'm happy that this calculator helps people who lives with T1D. But I'm not endocrinologist and this calculator cannot be treated as an official medical nutrition guide for diabetics. If you need a medical advice, please consult a specialist."
}

const ruText = {
      "pageTitle":            "Хлебная Единица"
    , "breadUnitTitle":       "Хлебная Единица"
    , "whatIsItButton":       "Что это?"
    , "agree":                "Понятно"
    , "foodName":             "Название продукта"
    , "foodNameHelper":       "Начните печатать название..."
    , "or":                   "или"
    , "carbs":                "Углеводы на 100 г"
    , "carbsHelper":          "Введите значение от 0 до 100"
    , "gramms":               "Граммы"
    , "grammsHelper":         "Количество в граммах"
    , "bunits":               "ХЕ"
    , "bunitsHelper":         "Количество в хлебных единицах"
    , "me":                   "Денис Шевченко"
    , "whatIsIt":             "Что это"
    , "whatIsItDetails":      "Калькулятор хлебных единиц (ХЕ) для диабетиков, переводит ХЕ в граммы и наоборот."
    , "howToUseIt":           "Как им пользоваться"
    , "howToUseItDetails":    "Выберите продукт в поле «Название продукта», начните печатать и вам будут предложены соответствующие варианты. Если среди них нет вашего продукта, в поле «Углеводы» введите количество углеводов на 100 г продукта. Затем укажите количество: если введёте в граммах, увидите рассчитанное количество в ХЕ, если же введёте в ХЕ, калькулятор рассчитает количество в граммах."
    , "disclaimer":           "Внимание!"
    , "disclaimerDetails":    "Я очень рад, что мой калькулятор помогает людям, живущим с сахарным диабетом. Однако я не эндокринолог, и этот калькулятор не может рассматриваться как медицинское руководство по питанию для диабетиков. Если вам нужна медицинская консультация — пожалуйста, обратитесь к специалисту."
}

function translate(localizedText){
    $("[data-tkey]").each (function (index) {
        const localizedStr = localizedText[$(this).attr ("data-tkey")];
        $(this).html(localizedStr);
    });
}

function setLanguage(lang) {
    localStorage.setItem("BU_language", lang);
    currentLanguage = lang;
    if (lang == "ru") {
        translate(ruText);
    } else {
        translate(enText);
    }
    // If use changed the language - reset everything.
    $("#aForm").trigger("reset");
    // Set focus to force the label go up.
    $("#carbs").focus();
    $("#in_gramms").focus();
    $("#in_bunits").focus();
    // Load the list for food autocomplete, corresponding to selected language.
    $("#food_name").autocomplete(createAutocompleteFor(lang));
    $("#food-name-helper-id").css("color", "rgba(0,0,0,0.54)"); // From Materialize CSS.
    cleanNDisableAmountInputs();
    // We assume that user wants to input the food name by default, not the carbs value.
    $("#food_name").focus();
}

function createAutocompleteFor(lang) {
    var ob = {};
    for (const foodNames of food.keys()) {
        const name = foodNames[lang];
        ob[name] = null; // We don't need items pictures.
    }
    return { "data": ob
           , onAutocomplete: function () {
                   // Food is selected, so it's definitely correct, remove error message;
                   $("#food-name-helper-id").html("");
                   enableAmountInputs();
                   // ...
                   const foodName = $.trim( $("#food_name").val() );
                   for (const keyFoodNames of food.keys()) {
                       const name = keyFoodNames[currentLanguage];
                       if (foodName && (name === foodName)) {
                           // Store corresponding carbs value for calculation.
                           currentCarbsIn100g = food.get(keyFoodNames);
                           break;
                       }
                   }
               }
           };
}

function calculateFoodAmount() {
    $("#in_gramms").on("input",function(e){
        if ($("#in_gramms").val()) {
            const howManyGrams = parseFloat($("#in_gramms").val());
            $("#in_bunits").val(convertToBU(howManyGrams));
        } else {
            // If one there's no gramms - there's no bunits as well.
            cleanInput("#in_bunits");
        }
    });

    $("#in_bunits").on("input",function(e){
        if ($("#in_bunits").val()) {
            const howManyBU = parseFloat($("#in_bunits").val());
            $("#in_gramms").val(convertToGrams(howManyBU));
        } else {
            // If one there's no bunits - there's no gramms as well.
            cleanInput("#in_gramms");
        }
    });
}

function convertToGrams(howManyBU) {
    const howManyBUIn100g = currentCarbsIn100g / gramsIn1BU;
    // howManyBUIn100g -> 100 g
    // howManyBU       -> ? g
    const howManyGrams = (howManyBU * 100.0) / howManyBUIn100g;
    // There's no reason to show grams as a float number: kitchen scales are not so precise. ;-)
    return Math.round(howManyGrams);
}

function convertToBU(howManyGrams) {
    const howManyBUIn100g = currentCarbsIn100g / gramsIn1BU;
    // 100 g        -> howManyBUIn100g
    // howManyGrams -> ? BU
    const howManyBU = (howManyGrams * howManyBUIn100g) / 100.0;
    // There's no reason to show more than 2 numbers after point.
    return Number((howManyBU).toFixed(2));
}

function createFood() {
    const food = new Map(
        [ [{ "ru": "Абрикос"
           , "en": "Apricot"
           }, 9.0]
        , [{ "ru": "Апельсин"
           , "en": "Orange"
           }, 8.1]
        , [{ "ru": "Арбуз"
           , "en": "Watermelon"
           }, 5.8]
        , [{ "ru": "Банан"
           , "en": "Banana"
           }, 21.8]
        , [{ "ru": "Блины"
           , "en": "Pancakes"
           }, 26.0]
        , [{ "ru": "Виноград"
           , "en": "Grapes"
           }, 17.0]
        , [{ "ru": "Вишня"
           , "en": "Cherry"
           }, 11.3]
        , [{ "ru": "Дыня"
           , "en": "Melon"
           }, 7.4]
        , [{ "ru": "Капуста белокочанная"
           , "en": "Cabbage"
           }, 4.7]
        , [{ "ru": "Картофель жареный"
           , "en": "Fried potatoes"
           }, 23.4]
        , [{ "ru": "Каша гречневая"
           , "en": "Buckwheat porridge"
           }, 25.0]
        , [{ "ru": "Каша овсяная на молоке"
           , "en": "Oatmeal"
           }, 14.2]
        , [{ "ru": "Лаваш армянский"
           , "en": "Armenian pita"
           }, 47.6]
        , [{ "ru": "Макароны отварные"
           , "en": "Pasta cooked"
           }, 23.2]
        , [{ "ru": "Мандарин"
           , "en": "Tangerine"
           }, 7.7]
        , [{ "ru": "Морковь"
           , "en": "Carrot"
           }, 6.9]
        , [{ "ru": "Персик"
           , "en": "Peach"
           }, 11.3]
        , [{ "ru": "Пюре картофельное"
           , "en": "Mashed potatoes"
           }, 14.7]
        , [{ "ru": "Рис белый отварной"
           , "en": "White rice cooked"
           }, 24.9]
        , [{ "ru": "Рис пропаренный отварной"
           , "en": "Steamed rice cooked"
           }, 27.7]
        , [{ "ru": "Сахар-песок"
           , "en": "Sugar"
           }, 99.7]
        , [{ "ru": "Сахар-рафинад"
           , "en": "Granulated sugar"
           }, 99.9]
        , [{ "ru": "Слива"
           , "en": "Plum"
           }, 9.6]
        , [{ "ru": "Хлеб белый"
           , "en": "Bread white"
           }, 49.1]
        , [{ "ru": "Черешня"
           , "en": "Merry"
           }, 11.5]
        , [{ "ru": "Чернослив"
           , "en": "Prunes"
           }, 57.5]
        , [{ "ru": "Чечевица отварная"
           , "en": "Lentil cooked"
           }, 20.1]
        , [{ "ru": "Яблоко Гольден"
           , "en": "Apple"
           }, 11.2]
        ]);
    return food;
}
