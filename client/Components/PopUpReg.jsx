import React, { useState, useEffect } from "react"
import { CircularProgress } from "@material-ui/core"
import SkillButton from "./SkillButton"
/*
signup pop up component
 */
const PopUpReg = (props) => {
  // initial state to submit info for authorization
  const info = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    skillsToTeach: {},
  }
  //state to submit info for authorization
  const [data, setData] = useState(info)
  //state to handle skills available in database
  const [skills, setSkills] = useState([])

  const [skillId, setSkillId] = useState({})
  //loading component while awaiting data
  const [isLoading, setIsLoading] = useState(true)

  const [errorOnSignup, setErrorOnSignup] = useState(false)

  // console.log('skill are', skills);
  // console.log('data', data);
  //getting skills on mount from backend
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      const res = await fetch("/api/allSkills")
      const response = await res.json()
      const skillNames = []
      for (let i = 0; i < response.length; i++) {
        skillNames.push(response[i].name)
        setSkillId((prevstate) => {
          prevstate[response[i].name] = response[i]._id
          return prevstate
        })
      }
      setSkills(skillNames)
    } finally {
      setIsLoading(false)
    }
  }
  //function to close popup window
  const handleClick = () => {
    props.toggleReg()
  }
  //if skills to teach weren't added to array - add, otherwise remove from array
  const skillButtonClick = (e) => {
    data.skillsToTeach[e]
      ? setData((prevstate) => {
          delete prevstate.skillsToTeach[e]
          return prevstate
        })
      : setData((prevstate) => {
          prevstate.skillsToTeach[e] = skillId[e]
          return prevstate
        })
  }

  const passwordEntered = (e) => {
    setData((data) => ({ ...data, password: e.target.value }))
  }

  const emailEntered = (e) => {
    setData((data) => ({ ...data, email: e.target.value }))
  }

  const firstNameEntered = (e) => {
    setData((data) => ({ ...data, firstName: e.target.value }))
  }

  const lastNameEntered = (e) => {
    setData((data) => ({ ...data, lastName: e.target.value }))
  }

  const findCookie = (cookies) => {
    let res = cookies.split("; ")
    let rightCookie = ""
    for (let i = 0; i < res.length; i++) {
      if (res[i].includes("ssid=")) {
        rightCookie = res[i].trim()
      }
    }
    res = rightCookie.split("=")[1]
    return res
  }

  const submitInfo = async () => {
    try {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const resp = await res.json()
      // console.log('resp', resp);
      if (!resp.hasLogged) {
        setErrorOnSignup(true)
      } else if (resp.hasLogged === "format") {
        setErrorOnSignup("format")
      } else if (resp.hasLogged === "empty") {
        setErrorOnSignup("empty")
      } else if (resp.hasLogged) {
        const rightCookie = findCookie(document.cookie)
        localStorage.setItem("email", `${data.email}`)
        if (rightCookie) {
          localStorage.setItem("token", rightCookie)
          localStorage.setItem(
            "name",
            `${resp.userInfo.firstName} ${resp.userInfo.lastName}`
          )
        }
        if (resp.userInfo.isAdmin) {
          localStorage.setItem("admin", "true")
        }
        props.setAuth(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (
      errorOnSignup === true ||
      errorOnSignup === "format" ||
      errorOnSignup === "empty"
    ) {
      setTimeout(() => {
        setErrorOnSignup(false)
      }, 3000)
    }
  }, [errorOnSignup])

  return (
    <div className="modal">
      <div className="modal_content_signup">
        {isLoading && (
          <div className="loading">
            <CircularProgress />
          </div>
        )}
        {!isLoading && (
          <div>
            <span className="close" onClick={handleClick}>
              &times;
            </span>
            <div>
              <h4>SIGNUP</h4>
              {errorOnSignup === true && (
                <div className="loginerror-message">
                  This email is registered in our system. Please try to login.
                </div>
              )}
              {errorOnSignup === "empty" && (
                <div className="loginerror-message">
                  All fields are required.
                </div>
              )}
              {errorOnSignup === "format" && (
                <div className="errordiv">
                  <div className="loginerror-message">
                    Incorrect email format. Please enter valid email.
                  </div>
                </div>
              )}
              <form className="loginform">
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={emailEntered}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={passwordEntered}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="name"
                    className="form-control"
                    placeholder="Enter first name"
                    onChange={firstNameEntered}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="name"
                    className="form-control"
                    placeholder="Enter last name"
                    onChange={lastNameEntered}
                  />
                </div>
                <div className="form-group-add">
                  Please select skills you can help others with
                </div>
                {skills.map((skill) => (
                  <SkillButton
                    key={skill}
                    id={skill}
                    onClick={skillButtonClick}
                    skill={skill}
                  />
                ))}
                <div className="form-group">
                  <button
                    type="button"
                    className="signupbutton"
                    onClick={submitInfo}
                  >
                    Signup
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PopUpReg
