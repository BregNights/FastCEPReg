async function consultZipCode(zipcode) {
    const api = 'https://viacep.com.br/ws/'+zipcode+'/json/'
    try {
        const getApi = await fetch(api)
        const data = await getApi.json()

        if (!getApi.ok) {
            throw new Error("Falha ao obter os dados da API.")
        }

        if (data.erro) {
            throw new Error("CEP não encontrado.")
        }

        return data
    } catch (error) {
        console.error("Erro na chamada da API:", error)
        return null
    }
    
}

//Campos globais
const fieldZipCode= document.querySelector('#zipCode')
const fieldState = document.querySelector('#state')
const fieldCity = document.querySelector('#city')
const fieldDistrict = document.querySelector('#district')
const fieldStreet = document.querySelector('#street')

function cleanFields() { // Limpar campos
    fieldZipCode.value = ""
    fieldState.value = ""
    fieldCity.value = ""
    fieldDistrict.value = ""
    fieldStreet.value = ""
}

function verifyZipCode(zipcode) { //Verifica se CEP é  um REGEX válido
    const regex = /^[0-9]{8}$/
    return regex.test(zipcode)
}

function addFields(promise) { //Preencher campos
    fieldState.value = promise.uf
    fieldCity.value = promise.localidade
    fieldDistrict.value = promise.bairro
    fieldStreet.value = promise.logradouro
}

document.querySelector('#zipCode').addEventListener("input", async function () {
    this.value = this.value.replace(/\D/g, '') // Bloquear letras e traços
    
    if (this.value.length === 8) { //Executa caso campo ficar completo
    const fieldZipCodeNoTrace = this.value

    // Preenche campos com (...) enquanto carrega dados da API
        fieldState.value = "..."
        fieldCity.value = "..."
        fieldDistrict.value = "..."
        fieldStreet.value = "..."
        
        try {
            if (verifyZipCode(fieldZipCodeNoTrace)) {
                const requestApi = await consultZipCode(fieldZipCodeNoTrace)
                if (requestApi) {
                    addFields(requestApi)
                } else {
                    alert("CEP não encontrado.")
                    cleanFields()
                }
            } else {
                //Cep Inválido
                cleanFields()
            }
        }catch (error) {
            console.error("Erro ao carregar dados", error)
            cleanFields()
        }
    }
})