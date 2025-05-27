import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class DBMetricmon {
	private static Connection conBD = null;
	private static Statement mStm = null;
	
	
	public static boolean comprobarDisponibilidadNombre(String nombreEntr) {
		DBMetricmon.conectar();
		boolean disponible = false;
		try {
	    	String query = "SELECT idEntr FROM entrenadores WHERE nombreEntr ='"+nombreEntr+"';";
	    	System.out.println(query);
	    	ResultSet rs = mStm.executeQuery(query);
	    	if (rs.next()) {
	    		disponible = false;
	    	
	    	
	    	}else {
	    	disponible = true;
	    	}
		}
	    	
	    catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	    return disponible;
	}
	
	

	public static void guardarEntrenador(String nombreEntr, String contrasena){
		DBMetricmon.conectar();
	    ///////////////////////////////////////INSTERTAR ENTRENADORES////////////////////////////////////////////////////////////
	    try {
	    	String query = "INSERT INTO entrenadores (nombreEntr,contrasena) VALUES ('"+nombreEntr+"','"+contrasena+"')";
	    	System.out.println(query);
	        mStm.executeUpdate(query);
	    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	    } catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	    
		}
	
	public static String descargarEntrenador() {
		String resultado = "";
		DBMetricmon.conectar();

	    try {
	    	String query = "SELECT `idEntr`, `nombreEntr`, `imagenEntr`,`id_pokemon` "
	    			+ "FROM `entrenadores`,`equipo`,usuario_actual "
	    			+ "WHERE `idEntr`= `id_entrenador` "
	    			+ "AND NOT `idEntr`= `id_actual` "
	    			+ "GROUP BY `idEntr` "
	    			+ "ORDER BY `idEntr` ";
	    	System.out.println(query);
	    	ResultSet rs = mStm.executeQuery(query);

	        while (rs.next()){
	        	resultado+="<div class='listaEntrenadoresDiv' id='"+rs.getString("idEntr")+"'>"
	        				+ "<p>"+rs.getString("nombreEntr")+"</p>"
	        				+ "<img class='img-entrenador' onclick='verDetallesEntrenador(\""+rs.getString("idEntr")+"\","
	        						+ "\""+rs.getString("nombreEntr")+"\","
	        						+ "\""+rs.getString("imagenEntr")+"\")' "
	        						+ "src='"+rs.getString("imagenEntr")+"'>"
	        				+ "</div>";
	        }
	        
	    } catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	    return resultado;
		}
	
	
	public static boolean comprobarMaxPkmns() {
		DBMetricmon.conectar();
		int resultado = 0;
		boolean maximo = false;
		
		try {
	    	String query = "SELECT Count(id_pokemon) FROM equipo WHERE id_entrenador = (SELECT id_actual FROM usuario_actual)";
	    	System.out.println(query);
	    	ResultSet rs = mStm.executeQuery(query);
	    	if (rs.next()) {
	    		resultado = resultado +rs.getInt("Count(id_pokemon)");
	    		if (resultado==6) {
	    			maximo = true;
	    			
	    		}else {
	    			maximo = false;
	    	}    	
	    	}
		}
	    	
	    catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
		
		
		System.out.println(maximo);
		return maximo;
	}
	
	public static void guardarPokemon(String nombreEntr, String idPokemon){
		DBMetricmon.conectar();
		
	    /////////////////////////////////////////////////QUERY ASIGNAR POKEMONS A UN ENTRENADOR//////////////////////////////////////////////////////////////
	    try {
	    	String query = "INSERT INTO equipo  VALUES"
	    			+ "((SELECT idEntr FROM entrenadores WHERE nombreEntr='"+nombreEntr+"'),"+idPokemon+");";
	    	System.out.println(query);
	        mStm.executeUpdate(query);
	    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	    } catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	    
		}
	
	public static void anadirPokemonDeLista(String idPokemon) {
		DBMetricmon.conectar();
		
	    try {
	    	String query = "INSERT INTO equipo  VALUES"
	    			+ "((SELECT id_actual FROM usuario_actual),"+idPokemon+");";
	    	System.out.println(query);
	        mStm.executeUpdate(query);
	    } catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	    
	}
	
	public static String descargarListaPokemon(String idEntr) {
		String resultado="";
		DBMetricmon.conectar();

	    try {
	    	String query = "SELECT id_pokemon FROM equipo WHERE id_entrenador = '"+idEntr+"'";
	    	System.out.println(query);
	    	ResultSet rs = mStm.executeQuery(query);
	    	
	    	resultado="[";
	        while (rs.next()){
	        	resultado=resultado+rs.getString("id_pokemon")+",";
	        }
	        resultado=resultado.substring(0,resultado.length()-1);
	        resultado+="]";
	    } catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	    System.out.println(resultado);
	    return resultado;
	}
	
	public static String descargarListaPokemonPerfil() {
		String resultado="";
		DBMetricmon.conectar();

	    try {
	    	String query = "SELECT id_pokemon FROM equipo WHERE id_entrenador = (SELECT id_actual FROM usuario_actual)";
	    	System.out.println(query);
	    	ResultSet rs = mStm.executeQuery(query);
	    	
	    	resultado+="[";
	        while (rs.next()){
	        	resultado=resultado+rs.getString("id_pokemon")+",";
	        }
	        resultado=resultado.substring(0,resultado.length()-1);
	        resultado+="]";
	    } catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	    System.out.println(resultado);
	    return resultado;
	}
	
	//////////////////////////////ELIMINAR POKEMON/////////////////////////////////////////////////////////
	public static void  eliminarPokemon(String idPokemon) {
		DBMetricmon.conectar();
		
	    try {
	    	String query = "DELETE FROM `equipo` "
	    			+ "WHERE id_entrenador=(SELECT id_actual FROM usuario_actual) AND id_pokemon="+idPokemon+" LIMIT 1";
	    	System.out.println(query);
	        mStm.executeUpdate(query);
	    } catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	    
	}
	
	
	/////////////////////////////////////CERRAR SESIÓN/////////////////////////////////////////////////////
	public static void cerrarSesion() {
		DBMetricmon.conectar();
		
	    try {
	    	String query = "UPDATE usuario_actual SET id_actual = 0" ;
	    	System.out.println(query);
	        mStm.executeUpdate(query);
	    } catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	    
	}
	
	
	
	/////////////////////////////////////////Comprobación de usuario y contraseña correctos///////////////////////////////////
	public static boolean comprobarCuenta(String nombreEntr, String contrasena) {
		boolean correcto = false;
		DBMetricmon.conectar();
		try {
	    	String query = "SELECT idEntr FROM entrenadores WHERE "
	    			+ "nombreEntr = '"+nombreEntr+"' "
	    			+ "AND contrasena = '"+contrasena+"';";
	    	System.out.println(query);
	    	ResultSet rs = mStm.executeQuery(query);
	        
	        if (rs.next()) {
	        	correcto = true;
	        }else {
	        	correcto = false;
	        }
	        
		} catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	    	System.out.println(correcto);
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }return correcto;
	}
	
	public static void iniciarSesion(String nombreEntr) {
		DBMetricmon.conectar();
	    try {
	    	String query = " UPDATE usuario_actual SET id_actual = (SELECT idEntr FROM entrenadores WHERE nombreEntr = '"+nombreEntr+"')";
	    	System.out.println(query);
	        mStm.executeUpdate(query);
	    } catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	    
		

	}
	
	/////////////////////////////////ESTABLECER FOTO DE PERFIL///////////////////////////////////////////////
	public static void establecerImagen(String imagen) {
		DBMetricmon.conectar();
	    try {
	    	String query = "UPDATE entrenadores SET imagenEntr='"+imagen+"' WHERE idEntr=(SELECT id_actual FROM usuario_actual);";
	    	System.out.println(query);
	        mStm.executeUpdate(query);
	    } catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	}
	
	/////////////////////////////////WEB EN MODO SESIÓN INICIADA/////////////////////////////////////////////
	
	public static String webNombre() {
		String resultado="";
		DBMetricmon.conectar();

	    try {
	    	String query = "SELECT nombreEntr, imagenEntr FROM entrenadores WHERE idEntr = (SELECT id_actual FROM usuario_actual)";
	    	System.out.println(query);
	    	ResultSet rs = mStm.executeQuery(query);
	    	
	        while (rs.next()){
	        	if (rs.getString("imagenEntr")!=null) {
	        		resultado=resultado+"[\""+rs.getString("nombreEntr")+"\",\""+rs.getString("imagenEntr")+"\"]";
	        	}else {
	        		resultado=resultado+"[''"+rs.getString("nombreEntr")+"'']";
	        	}
	        }
	    } catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	    System.out.println(resultado);
	    return resultado;
	}
		
	
	
	
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////// C O M P A R A C I Ó N ////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	public static boolean validarComparacion(String idRival) {
		DBMetricmon.conectar();
		int nPk = 0;
		boolean valido = false;
	    try {
	    	String query = "SELECT id_pokemon FROM equipo WHERE id_entrenador = (SELECT id_actual FROM usuario_actual)"
	    			+ "UNION ALL "
	    			+ "SELECT id_pokemon FROM equipo WHERE id_entrenador = "+idRival+"";
	    	System.out.println(query);
	    	ResultSet rs = mStm.executeQuery(query);
	    	
	        while (rs.next()){
		    		nPk++;
		    		if (nPk==12) {
		    			valido=true;
		    	}else {
		    		valido=false;
		    	}
		    		System.out.println(nPk);
		    		}
	        
	    } catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	    System.out.println(valido);
	    return valido;
	    }
	
	public static String encontrarRival(String idRival) {
		DBMetricmon.conectar();
		String resultado="";
	    try {
	    	String query = "SELECT id_pokemon FROM equipo WHERE id_entrenador = (SELECT id_actual FROM usuario_actual)"
	    			+ "UNION ALL "
	    			+ "SELECT id_pokemon FROM equipo WHERE id_entrenador = "+idRival+"";
	    	System.out.println(query);
	    	ResultSet rs = mStm.executeQuery(query);
	    	
	    	resultado="[";
	    	while (rs.next()) {
	    		resultado=resultado+rs.getString("id_pokemon")+",";
	    	}
	    	resultado=resultado.substring(0,resultado.length()-1);
	    	resultado+="]";
	    	
	    } catch (SQLException error) {
	        System.out.println("Error al ejecutar SQL en servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm.close();
	        conBD.close();
	    } catch (SQLException error) {
	        System.out.println("Error al cerrar conexión a servidor MySQL/MariaDB: " + error.getMessage());
	    }
	    System.out.println(resultado);
		
		
		
		
		return resultado;
	}
	
	
	
	
	
	//////////////////////////////MÉTODO CONECTAR////////////////////////////////////////////////
	public static void conectar() {
		try {
	        Class.forName("com.mysql.cj.jdbc.Driver");
	    } catch (ClassNotFoundException error) {
	        System.out.println("Error al cargar el driver JDBC de MySQL: " + error.getMessage());
	    }
		
	    try {
	        conBD = DriverManager.getConnection(
	                "jdbc:mysql://localhost:3306/metricmon",
	                "root", "");
	    } catch (SQLException error) {
	        System.out.println("Error al conectar con el servidor MySQL/MariaDB: " + error.getMessage());
	    }

	    try {
	        mStm = conBD.createStatement();
	    } catch (SQLException error) {
	        System.out.println("Error al establecer declaración de conexión MySQL/MariaDB: " + error.getMessage());
	    }
	    
	}
}

