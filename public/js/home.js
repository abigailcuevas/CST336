var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

var modal1 = document.getElementById("myModal1");
var span1 = document.getElementsByClassName("close1")[0];

$("#submit").css("visibility", "hidden");


displayPic();

$(".clicker").on("click", display);
async function display(){
  $("#contactSend").html("");
 $("#theButton").show();
  console.log("display section");

  let contactId = $(this).attr("contactId");

  let url = `/contactInfo?id=${contactId}`;

  let response = await fetch(url);
  let data = await response.json();

  console.log(data[0].name);

  $("#contactInformation").html("<div id = 'cInformation'> For More Information Contact: </div>" + '<br />');

  $("#contactInformation").append("<span class='profileSection'></span>"  + data[0].name + '<br />' + '<br />');
  $(".profileSection").html(`<img src="${data[0].picture}" width="150px" id = "tryImg">`+ '<br />');
  $("#contactInformation").append("Address: " + data[0].address + '<br />' + "Gender: " + data[0].gender + '<br />');
  $("#contactInformation").append("Number: " + data[0].number + '<br />' + "Age: " + data[0].age + '<br />');
  modal.style.display = "block";

}
span.onclick = function() {
  modal.style.display = "none";   
}

async function displayPic(){
  let url = "https://api.unsplash.com/search/photos?query=dog-or-cat&orientation=landscape&client_id=UBe9X6Q9EhKLqpPDioVio0MwTLTOg-OyFV7x_88kl6g";

  let url2 = "https://dog.ceo/api/breed/corgi/images";
  
  let response = await fetch(url);
  let data = await response.json();

  response = await fetch(url2);
  let data2 = await response.json();

  var theId = document.querySelectorAll('.imgs');
  var length = theId.length;
  console.log(data2.message[0]);


  for(var i = 0; i < length; i++){
    console.log(i);
    var x = theId[i].id;
    var image = x;

    if(image <= 9){
      document.getElementById(`${x}`).src = `${data.results[image].urls.regular}`;
    }else{
       document.getElementById(`${x}`).src = `${data2.message[i+1]}`;
    }
    console.log(image);
  }
}

function inputInfo(){
  span.style.visibility = "hidden";
  $("#userInfo").html("");
  $("#userInfo").show();
  console.log("clicked");
  $("#theButton").hide();
  $("#contactInformation").hide();
  
  $("#userInfo").append('<h1> Contact Form </h1>'  + '<div> Name: <input type="text" name="input[]">' + '<br><br>' + '<div> e-Mail: <input type="text" name="input[]">' + '<br><br>' + '<textarea id="subject"  placeholder="Write you message here . . " style="height:80px; width:280px"></textarea> ' + '<br><br>');

  $("#submit").css("visibility", "visible");
}

function submit(){
   $("#submit").css("visibility", "hidden");
   $("#contactInformation").show();
    span.style.visibility = "visible";
    $("#userInfo").hide();
    $("#theButton").hide();
    $("#contactSend").html("Form Sent to Contact!").css('color','rgb(0, 119, 30)');
}



