import React, { useState } from 'react'
import { useNavigationPrompt, navigate } from '../../src/main.js'

export default function Form() {
  const [names, setNames] = useState([])
  const [newName, setName] = useState('')
  useNavigationPrompt(
    !!newName.length,
    'Are you sure you want to leave the name form?'
  )
  const handleSubmit = e => {
    e.preventDefault()
    setNames(names.concat(newName))
    setName('')
  }
  const saveAndNavigate = () => {
    setNames(names.concat(newName))
    navigate('/')
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={newName}
            onChange={e => setName(e.target.value)}
          />
        </label>
        <button type="submit">Add</button>
        <button onClick={saveAndNavigate}>Save and Leave</button>
      </form>
      <ul>
        {names.map(name => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  )
}
