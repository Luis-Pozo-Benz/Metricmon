

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet implementation class InicioSesion
 */
@WebServlet("/InicioSesion")
public class InicioSesion extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String entrenador;
	private String contrasena;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public InicioSesion() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */	
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		this.entrenador = request.getParameter("entrenador");
		this.contrasena = request.getParameter("contrasena");
		if (DBMetricmon.comprobarCuenta(entrenador, contrasena)); {
			DBMetricmon.iniciarSesion(entrenador);
		}

		
	}
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub		
		if (DBMetricmon.comprobarCuenta(entrenador, contrasena)) {
			response.getWriter().append("correcto");
			System.out.println("correcto");
		}else {
			response.getWriter().append("incorrecto");
			System.out.println("incorrecto");
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */


}
