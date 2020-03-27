import React, {useState, useEffect} from "react";
import axios from "axios";
import * as yup from "yup";
import { Link } from "react-router-dom"

const formSchema = yup.object().shape({
    name: yup.string().required("please input a name").min(2, "name must be more than 2 characters"),
    email: yup.string().email("must be a valid email").required("email is a required field"),
    address: yup.string().required("address is a required field"),
    flavor: yup.string().required("we need to know your flavor!!!"),
    size: yup.string().required("must include a size for your shirt"),
    terms: yup.boolean().oneOf([true], "must agree to terms")
});

export default function Form() {
    // state for your button and whether you can submit depending on if you fill out required fields
    const [button, setButton] = useState(true);

    // state for our form
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        address: "",
        flavor: "",
        size: "",
        terms: ""
    });

    // state for our errors
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        address: "",
        flavor: "",
        size: "",
        terms: ""
    });

    // state for our post request 
    const [post, setPost] = useState([]);

    useEffect(() => {
        formSchema.isValid(formState).then(valid => {
            setButton(!valid);
        });
    }, [formState]);

    const formSubmit = e => {
        e.preventDefault();
        axios
            .post("https://reqres.in/api/orders", formState)
            .then(res => {
                setPost(res.data); 

                setFormState({
                    name: "",
                    email: "",
                    address: "",
                    flavor: "",
                    size: "",
                    terms: ""
                });
            })
            .catch(err => console.log("something went wrong when submitting your form", err.response));
    };

    const validateChange = e => {
        yup 
            .reach(formSchema, e.target.name)
            .validate(e.target.name === "terms" ? e.target.checked : e.target.value)
            .then(valid => {
                setErrors({
                    ...errors,
                    [e.target.name]: ""
                });
            })
            .catch(err => {
                setErrors({
                    ...errors,
                    [e.target.name]: err.errors[0]
                });
            });
    };

    const inputChange = e => {
        e.persist(); // constantly checking to see what the user is typing in and checking if its valid
        const newFormData = {
            ...formState,
            [e.target.name]:
            e.target.type  === "checkbox" ? e.target.checked : e.target.value
        };
        validateChange(e);
        setFormState(newFormData);
    };

    return (
        <form onSubmit={formSubmit}>
              <Link to={"/"}>
                <div>Home</div>
                </Link>
            <h1>If you could be any flavor...what flavor would you be?</h1>
            <label htmlFor="name">
                Name: 
                <input
                    id="name" // connects to the htmlFor
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={inputChange}
                />
                {/* this error 👇 connects with the schema for the first error that we have written */}
                 {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null} 
            </label> <br/>
            <label htmlFor="email">
                Email: 
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={inputChange}
                />
                 {errors.email.length > 0 ? <p className="error">{errors.email}</p> : null} 
            </label> <br/>
            <label htmlFor="address">
                Address: 
                <input
                    id="address"
                    type="text"
                    name="address"
                    value={formState.address}
                    onChange={inputChange}
                />
                 {errors.address.length > 0 ? <p className="error">{errors.address}</p> : null} 
            </label> <br/>
            <label htmlFor="flavor">
                What flavor do you identify as? 
                <textarea
                    id="flavor"
                    name="flavor"
                    value={formState.flavor}
                    onChange={inputChange}
                />
                 {errors.flavor.length > 0 ? <p className="error">{errors.flavor}</p> : null} 
            </label> <br/>
            <label htmlFor="size">
                What size t-shirt would you like?
                 <select 
                    id="size" 
                    name="size" 
                    onChange={inputChange}>
                    <option value="small">small</option>
                    <option value="medium">medium</option>
                    <option value="large">large</option>
                </select>
            </label> <br/>
            <label htmlFor="terms">
                No refunds!
                <input
                    id="terms"
                    type="checkbox"
                    name="terms"
                    checked={formState.terms}
                    onChange={inputChange}
                />
                 {errors.terms.length > 0 ? <p className="error">{errors.terms}</p> : null} 
            </label>
              {/* displaying our post request data */}
              <pre>{JSON.stringify(post, null, 2)}</pre>
              <button disabled={button}>Submit</button>
        </form>
    )

}