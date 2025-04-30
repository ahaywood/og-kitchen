const Og = ({ title }: { title: string }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", width: "100vw", fontFamily: "sans-serif", background: "#160f29" }}>
      <div style={{ display: "flex", width: "100vw", padding: 40, color: "white" }}>
        <h1 style={{ fontSize: 60, fontWeight: 600, margin: 0, fontFamily: "Bitter" }}>{title}</h1>
        </div>
      </div>
  )
}

export default Og