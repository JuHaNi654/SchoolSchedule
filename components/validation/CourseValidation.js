/**
|--------------------------------------------------
| Exported @function validate will check if 
| any of the @param course properties value is null.
| If there is null propertie in object, then it will call @function errMessage with passed @param property
| value which has null value and @function errorCB which callback given function.
| If course doesnt have any null values it will call @function successCB given callback function with
| @param course on it.
| Notice that it will throw error function on first property, wich has null value.
|--------------------------------------------------
*/

const validate = (course, successCB, errorCB) => {
    for (let property in course) {
        if (course[property] === null) {
            errMessage(property, errorCB)
            return
        }
    }
    successCB(course)
}

/**
|--------------------------------------------------
| Function takes @param prop value which goes to swtich case
| and fill call given callback @function callErrorFunction with custom error message function, so that
| in newTimestamp file function can alert with custom message
|--------------------------------------------------
*/
function errMessage(prop, callErrorFunction) {
    switch (prop) {
        case 'startingTime':
            callErrorFunction('Error!', 'Course starting time must be selected')
            break;
        case 'endingTime':
            callErrorFunction('Error!', 'Course ending time must be selected')
            break;
        case 'courseName':
            callErrorFunction('Error!', 'Course name input field cannot be empty')
            break;
        case 'courseId':
            callErrorFunction('Error!', 'Course id field input field cannot be empty')
            break;
        case 'classRoom':
            callErrorFunction('Error!', 'Classroom input field cannot be empty')
            break;
        case 'weekday':
            callErrorFunction('Error!', 'Weekday must be selected')
            break;
        default:
            break;
    }
}

module.exports = {
    validate
}