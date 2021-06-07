import css from 'styled-jsx/css'

export default css.global`
  img {
    width: 100%;
    height: auto;
    aspect-ratio: auto;
  }
  body {
    font-family: system-ui, sans-serif;
    margin: 0;
  }

  a.app-btn {
    margin-top: 14px;
    padding: 8px;
    background-color: blue;
    border-radius: 6px;
    color: #fff;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
  }

  @media (prefers-color-scheme: dark) {
    body {
      background-color: #212121;
      color: white;
    }
  }
`
