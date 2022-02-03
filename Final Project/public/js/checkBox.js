function checking(b){ 
  console.log("here")
  var x = document.getElementsByClassName('selectOne');
  var i;

  for (i = 0; i < x.length; i++) {
    if(x[i].value != b) x[i].checked = false;
  }
}

showImage();
console.log("show image");


async function showImage(){


const url = `https://catfact.ninja/facts?limit=4&max_length=140`;
let response = await fetch(url);
let data1 = await response.json();
  
  console.log(data1.data[0].fact);

   $("#bodySection").html(data1.data[0].fact + '<br>' + '<br>'  + data1.data[1].fact);
}