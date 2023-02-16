$("#rollNo").focus();

let connectionToken = "90938268|-31949273178623729|90952451";
let stdDBName = "SCHOOL-DB";
let stdRelationName = "STUDENT-TABLE";
let jpdbBaseurl = "http://api.login2explore.com:5577";
let jpdbIRL = "/api/irl";
let jpdbIML = "/api/iml";

function saveRecord(jsonObj) {
    let dataVal = JSON.parse(jsonObj.data);
    localStorage.setItem("recordNo", dataVal.rec_no);
}

function getrollNoJsonObj() {
    let data_val = $("#rollNo").val();
    let jsonStr = {
        rollNo: data_val
    };
    return JSON.stringify(jsonStr);

}

function fillData(jsonObj) {

    saveRecord(jsonObj);
    let record = JSON.parse(jsonObj.data).record;
    $("#rollNo").val(record.rollNo);
    $("#stdName").val(record.stdName);
    $("#stdClass").val(record.stdClass);
    $("#stdDob").val(record.stdDob);
    $("#stdAdd").val(record.stdAdd);
    $("#enrlDate").val(record.enrlDate);
    return;
}

function get_request(token, dbname, relationName, jsonObjStr) {
    let value1 = "{\n"
        + "\"token\" : \""
        + token
        + "\",\n"
        + "\"dbName\": \""
        + dbname
        + "\",\n"
        + "\"cmd\" : \"GET_BY_KEY\",\n"
        + "\"rel\" : \""
        + relationName
        + "\",\n"
        + "\"jsonStr\":\n"
        + jsonObjStr
        + "\n"
        + "}";
    return value1;
}

function getData() {
    let rollNoJsonObj = getrollNoJsonObj();
    let getRequest = get_request(connectionToken, stdDBName, stdRelationName, rollNoJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseurl, jpdbIRL);
    jQuery.ajaxSetup({ async: true });
    if (resObj.status === 400) {
        $("#stdSave").prop("disabled", false);
        $("#stdReset").prop("disabled", false);
        $("#stdName").focus();
    }
    else if (resObj.status === 200) {
        $("#rollNo").prop("disabled", true);
        $("#stdSave").prop("disabled", true);
        fillData(resObj);
        $("#stdUpdate").prop("disabled", false);
        $("#stdReset").prop("disabled", false);
        $("#rollNo").focus();
    }
}

function validateAndGetFormData() {
    let stdRollNo = $("#rollNo").val();
    if (stdRollNo === "") {
        alert("Student Roll No. is mandatory.");
        $("#rollNo").focus();
        return "";
    }
    let stdNameVar = $("#stdName").val();
    if (stdNameVar === "") {
        alert("Student name is mandatory");
        $("#stdName").focus();
        return "";
    }
    let stdClassvar = $("#stdClass").val();
    if (stdClassvar === "") {
        alert("Class input is mandatory");
        $("#stdClass").focus();
        return "";
    }
    let stdDobvar = $("#stdDob").val();
    if (stdDobvar === "") {
        alert("DOB is mandatory");
        $("#stdDob").focus();
        return "";
    }
    let stdAddvar = $("#stdAdd").val();
    if (stdAddvar === "") {
        alert("Address is mandatory");
        $("#stdAdd").focus();
        return "";
    }
    let enrlDatevar = $("#enrlDate").val();
    if (enrlDatevar === "") {
        alert("Enrollment Date is mandatory");
        $("#enrlDate").focus();
        return "";
    }
    let jsonStrObj = {
        rollNo: stdRollNo,
        stdName: stdNameVar,
        stdClass: stdClassvar,
        stdDob: stdDobvar,
        stdAdd: stdAddvar,
        enrlDate: enrlDatevar
    };
    return JSON.stringify(jsonStrObj);
}

function resetForm() {
    $("#rollNo").val("");
    $("#stdName").val("");
    $("#stdClass").val("");
    $("#stdDob").val("");
    $("#stdAdd").val("");
    $("#enrlDate").val("");
    $("#rollNo").prop("disabled", false);
    $("#stdSave").prop("disabled", false);
    $("#stdUpdate").prop("disabled", false);
    $("#stdReset").prop("disabled", false);
    $("#rollNo").focus();
}

function updateStudent() {
    $("#stdUpdate").prop("disabled", true);
    jsonChg = validateAndGetFormData();
    let updateRequest = createUPDATERecordRequest(connectionToken, jsonChg, stdDBName, stdRelationName, localStorage.getItem("recordNo"));
    jQuery.ajaxSetup({ async: false });
    let resObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseurl, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $("#rollNo").focus();
}

function saveStudent() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    var putReqStr = createPUTRequest(connectionToken, jsonStr, stdDBName, stdRelationName);
    jQuery.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseurl, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $("#rollNo").focus();
}