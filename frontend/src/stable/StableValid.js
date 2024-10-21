function Validation(values) 
{
    let error = {};

    if (values.name.trim() === "") {
        error.name = "Pole nie może być puste!";
    } else {
        error.name = "";
    }

    if (values.location.trim() === "") {
        error.location = "Pole nie może być puste!";
    } else {
        error.location = "";
    }

    return error;
}

export default Validation;