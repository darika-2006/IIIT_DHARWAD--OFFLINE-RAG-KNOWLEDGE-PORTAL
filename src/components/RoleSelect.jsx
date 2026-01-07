export default function RoleSelect({ setRole }) {
  return (
    <div className="page-center">
      <div className="card">
        <div className="team-name" style={{gap : "5px", fontWeight : "600", marginBottom: "20px", textAlign: "center"}}>
        <h1>Aerothon</h1>
        <h3>Offline AI Powered RAG</h3>
          Powered by Team The HACKALTITUDE
      </div>
    
        <h2>Select Role</h2>

        <div className="role-buttons">
          <button onClick={() => setRole("admin")}>Admin</button>
          <button onClick={() => setRole("employee")}>Employee</button>
        </div>
      </div>
    </div>
  );
}
