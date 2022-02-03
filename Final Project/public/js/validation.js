//check the contact section to make sure that the
//things inputed are not blank
function validateContact(){
  $("#mess2").html("");

  var name = $("#cName").val();
  var gender = $("#cGender").val();
  var number = $("#cNum").val();
  var age = $("#cAge").val();
  var picture = $("#cPic").val();
  var address = $("#cAdd").val();

  if (name == "" || gender == "" || number == "" || age=="" || picture =="" || address == "") {
    $("#mess2").html("Please don't leave any of the following blanks!");
    return false;
  } else {

    if (confirm('Are you sure you want to update the following?')) {
      console.log('contact updated.');
      return true;
    } 
    else {
      $("#mess2").html("Contact was not updated!");
      console.log('Cancelled.');
      return false;
    } 
  }
}
//check the pet section to make sure that the
//things inputed are not blank
function validatPet(){
  $("#mess1").html("");

  var name = $("#pName").val();
  var city = $("#pCity").val();
  var state = $("#pState").val();
  var price = $("#pPrice").val();
  var des = $("#pDescription").val();

  if (name == "" || city == "" || state == "" || price=="" || des =="") {
    $("#mess1").html("Please don't leave any of the following blanks!");
    return false;
  } else {

    if (confirm('Are you sure you want to update the following?')) {
      console.log('pet updated.');
      return true;
    } 
    else {
      $("#mess").html("Pet was not updated!");
      console.log('Cancelled.');
      return false;
    } 
  }
}
//check the user section to make sure that the
//things inputed are not blank
function validateUser(){
  $("#mess").html("");

  var username = $("#uUser").val();
  var pass = $("#uPass").val();

  if (username == "" || pass == "") {
    $("#mess").html("Please don't leave any of the following blanks!");
    return false;
  } else {

    if (confirm('Are you sure you want to update the following?')) {
      console.log('user updated.');
      return true;
    } 
    else {
      $("#mess").html("Contact was not updated!");
      console.log('Cancelled.');
      return false;
    } 
  }
}