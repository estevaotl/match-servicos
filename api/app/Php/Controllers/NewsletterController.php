<?php 
    namespace App\Php\Controllers;

    use Illuminate\Http\Request;

    class NewsletterController extends Controller
    {
        public function index(Request $request)
        {
            if ($request->isMethod('post')) {
                // Lógica para tratar a requisição POST
                return response()->json(['message' => 'Requisição POST recebida']);
            } else {
                // Lógica para tratar a requisição GET
                return response()->json(['message' => 'Requisição GET recebida']);
            }
        }

        public function inscrever(Request $request)
        {
            // Lógica para tratar a requisição POST da subrota /inscricao
            return response()->json(['message' => 'Inscrição realizada com sucesso']);
        }
    }
