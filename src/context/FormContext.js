import { createContext, useState, useEffect } from "react"

const FormContext = createContext({})

const title = {
    0: 'Billing Info',
    1: 'Shipping Info',
    2: 'Opt-In'
}

export const FormProvider = ({ children }) => {

    const [page, setPage] = useState(0)

    const [data, setData] = useState({
        billFirstName: "",
        billLastName: "",
        billAddress1: "",
        billAddress2: "",
        billCity: "",
        billState: "",
        billZipCode: "",
        sameAsBilling: false,
        shipFirstName: "",
        shipLastName: "",
        shipAddress1: "",
        shipAddress2: "",
        shipCity: "",
        shipState: "",
        shipZipCode: "",
        optInNews: false
    })


    useEffect(() => {
        if (data.sameAsBilling) {
            setData(prevData => ({
                ...prevData,
                shipFirstName: prevData.billFirstName,
                shipLastName: prevData.billLastName,
                shipAddress1: prevData.billAddress1,
                shipAddress2: prevData.billAddress2,
                shipCity: prevData.billCity,
                shipState: prevData.billState,
                shipZipCode: prevData.billZipCode
            }))
        } else {
            setData(prevData => ({
                ...prevData,
                shipFirstName: "",
                shipLastName: "",
                shipAddress1: "",
                shipAddress2: "",
                shipCity: "",
                shipState: "",
                shipZipCode: ""
            }))
        }
    }, [data.sameAsBilling])


    const handleChange = e => {
        const type = e.target.type

        const name = e.target.name

        const value = type === "checkbox"
            ? e.target.checked
            : e.target.value

        setData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    let canSubmit
    if (page === Object.keys(title).length - 1) {
        const {
            billAddress2,
            sameAsBilling,
            shipAddress2,
            optInNews,
            ...requiredInputs } = data

        canSubmit = [...Object.values(requiredInputs)].every(Boolean)
    }

    const starter = {
        0: 'bill',
        1: 'ship'
    }

    const canNextPage = Object.keys(data)
        .filter(key => key.startsWith(starter[page]) && key !== `${starter[page]}Address2`)
        .map(key => data[key])
        .every(Boolean)

    const disablePrev = page === 0

    const disableNext =
        (page === Object.keys(title).length - 1)
        || (page === 0 && !canNextPage)
        || (page === 1 && !canNextPage)

    const prevHide = page === 0 && "remove-button"

    const nextHide = page === Object.keys(title).length - 1 && "remove-button"

    const submitHide = page !== Object.keys(title).length - 1 && "remove-button"

    return (
        <FormContext.Provider value={{ title, page, setPage, data, setData, canSubmit, handleChange, disablePrev, disableNext, prevHide, nextHide, submitHide }}>
            {children}
        </FormContext.Provider>
    )
}

export default FormContext 