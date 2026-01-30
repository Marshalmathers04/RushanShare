const form = document.querySelector("form")
form.addEventListener("submit",async (e)=>{
	e.preventDefault()
	const vercode = +document.getElementById("verificationcode").value
	const errText = document.getElementById("error-msg")	

	try{
		const res = await fetch("/verifyphone",{
				method:"POST",
				headers:{"Content-Type":"application/json"},
				body:JSON.stringify({code:vercode})
			})
		const data = await res.json()
		if (res.ok){
			window.location.href = data.route
		}else{
			errText.innerText = data.error
			
		}
	}catch(err){
		console.log(`Server not responding:${err}`)
	}
})
