

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet implementation class AddPokemon
 */
@WebServlet("/AddPokemon")
public class AddPokemon extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AddPokemon() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String entrenador = request.getParameter("idEntrenador");
		response.getWriter().append(DBMetricmon.descargarListaPokemon(entrenador));
		}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String entrenador = request.getParameter("nomEntrenador");
		String pokemon = request.getParameter("idPokemon");
		Integer.parseInt(pokemon);
		if (!DBMetricmon.comprobarMaxPkmns()) {
			DBMetricmon.comprobarMaxPkmns();
			DBMetricmon.guardarPokemon(entrenador, pokemon);
		}		
	}

}
