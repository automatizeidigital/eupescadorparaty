import { supabase } from "@/integrations/supabase/client";

export const profileService = {
  /**
   * Atualiza o perfil do usuário logado diretamente via Supabase Browser Client.
   * Garante que o contexto da sessão seja preservado no navegador.
   */
  async updateMyProfile(values: any) {
    // 1. Verificar usuário antes do save
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Erro ao obter usuário:", userError);
      return { 
        success: false, 
        error: { 
          message: "Sua sessão expirou. Entre novamente para concluir seu cadastro.",
          code: "AUTH_EXPIRED" 
        } 
      };
    }

    // 2. Diagnóstico de sessão para homologação (Logs seguros)
    console.log("Tentativa de save - Authenticated: true, User ID presente: true");

    // 3. Normalização básica e preparação dos dados
    // Adaptado aos campos reais da tabela profiles conforme especificação
    const updates = {
      full_name: values.full_name,
      cpf: values.cpf?.replace(/\D/g, ''), // Normalizar CPF
      phone: values.phone?.replace(/\D/g, ''), // Normalizar Telefone
      community: values.community,
      locality: values.locality,
      fisher_type: values.fishing_type, // Mapeado de fishing_type do form para fisher_type do banco
      emergency_contact_name: values.emergency_contact_name,
      emergency_contact_phone: values.emergency_contact_phone?.replace(/\D/g, ''),
      emergency_contact_relation: values.emergency_contact_relation,
      registration_completed: true,
      updated_at: new Date().toISOString(),
    };

    // 4. Executar UPDATE (Não usar upsert conforme requisito)
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Erro no profile update:", error.code, error.message, error.details);
      
      let friendlyMessage = "Erro ao salvar cadastro. Tente novamente.";
      
      if (error.code === '42501') {
        friendlyMessage = "Erro de permissão ao salvar seus dados. Contate o suporte.";
      } else if (error.message.includes("not found")) {
        friendlyMessage = "Seu registro de perfil não foi encontrado. Tente sair e entrar novamente.";
      } else if (error.code === '23505') {
        friendlyMessage = "Este CPF ou telefone já está em uso.";
      }

      return { 
        success: false, 
        error: { 
          message: friendlyMessage,
          code: error.code,
          details: error.message
        } 
      };
    }

    return { success: true, data };
  },

  /**
   * Obtém o perfil do próprio usuário.
   */
  async getMyProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Erro ao obter perfil:", error);
      return null;
    }
    return data;
  }
};
