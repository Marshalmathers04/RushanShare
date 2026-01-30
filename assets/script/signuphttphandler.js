const form = document.querySelector("form")
form.addEventListener("submit",async (e)=>{
	e.preventDefault()
	const username = document.getElementById("username").value.trim()
	const password = document.getElementById("password").value
	const phone = document.getElementById("phone").value	
	const errText = document.getElementById("error-msg")
	try{
		const res = await fetch("/signup",{
			method:"POST",
			headers:{"Content-Type":"application/json"},
			body:JSON.stringify({username,password,phone})
		})
		const data = await res.json()
		if (res.ok){
			window.location.href = data.route
		}else{
			errText.innerText = data.error
		}

	}catch(err){
		console.log(err)
	}
})


