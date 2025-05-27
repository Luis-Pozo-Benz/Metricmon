

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class Servlet
 */
@WebServlet("/NomEntrenador")
public class NomEntrenador extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private boolean disponible = true;
    /**
     * Default constructor. 
     */
    public NomEntrenador() {
    	super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		if (this.disponible==false) {
			response.getWriter().append("Nombre no disponible");
			System.out.println("false");
		}else {
			System.out.println("true");
			response.getWriter().append(DBMetricmon.descargarEntrenador());		
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		if (DBMetricmon.comprobarDisponibilidadNombre(request.getParameter("entrenador"))) {
			this.disponible = true;
			DBMetricmon.guardarEntrenador(request.getParameter("entrenador"),request.getParameter("contrasena"));
		}else {
			this.disponible = false;
		}
		
		
	}

}
