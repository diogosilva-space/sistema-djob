'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { rhService } from '@/features/rh/api/rh.service';

type TabType = 'pessoais' | 'contato' | 'documentacao' | 'contratuais' | 'bancarios';

function FormEmployee() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState<TabType>('pessoais');
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [salary, setSalary] = useState<number>(0);
  const [status, setStatus] = useState('ACTIVE');
  const [zipCode, setZipCode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (employeeId) {
      const loadEmployee = async () => {
        try {
          setLoading(true);
          const emp = await rhService.getEmployeeById(employeeId);
          setName(emp.name || '');
          setDocument(emp.document || '');
          setEmail(emp.email || '');
          setPhone(emp.phone || '');
          setPosition(emp.position || '');
          setDepartment(emp.department || '');
          if (emp.admissionDate) {
            setAdmissionDate(new Date(emp.admissionDate).toISOString().split('T')[0] as string);
          }
          setSalary(Number(emp.salary || 0));
          setStatus(emp.status || 'ACTIVE');
          setZipCode(emp.zipCode || '');
          setStreet(emp.street || '');
          setNumber(emp.number || '');
          setComplement(emp.complement || '');
          setNeighborhood(emp.neighborhood || '');
          setCity(emp.city || '');
          setState(emp.state || '');
          setNotes(emp.notes || '');
        } catch (err) {
          console.error('Erro ao carregar funcionário', err);
        } finally {
          setLoading(false);
        }
      };
      loadEmployee();
    }
  }, [employeeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const payload = {
        name,
        document: document || null,
        email: email || null,
        phone: phone || null,
        position: position || null,
        department: department || null,
        admissionDate: admissionDate ? new Date(admissionDate).toISOString() : null,
        salary: Number(salary),
        status: status as any,
        zipCode: zipCode || null,
        street: street || null,
        number: number || null,
        complement: complement || null,
        neighborhood: neighborhood || null,
        city: city || null,
        state: state || null,
        notes: notes || null,
      };

      if (employeeId) {
        await rhService.updateEmployee(employeeId, payload);
      } else {
        await rhService.createEmployee(payload);
      }
      router.push('/rh');
    } catch (err) {
      console.error('Erro ao salvar colaborador', err);
    }
  };

  const handleZipCodeBlur = async () => {
    if (!zipCode || zipCode.replace(/\D/g, '').length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setStreet(data.logradouro || '');
        setNeighborhood(data.bairro || '');
        setCity(data.localidade || '');
        setState(data.uf || '');
      }
    } catch (err) {
      console.error('Erro ao buscar CEP', err);
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'pessoais', label: 'Dados Pessoais' },
    { id: 'contato', label: 'Contato e Endereço' },
    { id: 'documentacao', label: 'Documentação' },
    { id: 'contratuais', label: 'Dados Contratuais' },
    { id: 'bancarios', label: 'Dados Bancários' },
  ];

  if (loading) {
    return <div className="text-center py-12">Carregando dados do colaborador...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {employeeId ? 'Editar Colaborador' : 'Admitir Novo Colaborador'}
        </h1>
        <p className="text-muted-foreground">
          Ficha de registro de funcionário para o departamento pessoal
        </p>
      </div>

      {/* Navegação de Abas Personalizada e Responsiva */}
      <div className="border-b flex gap-1 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-white">
          <CardContent className="p-6">
            {/* ABA: DADOS PESSOAIS */}
            {activeTab === 'pessoais' && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Nome Completo</label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome completo do colaborador"
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">E-mail</label>
                    <input
                      type="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemplo@djob.com"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">Telefone / Celular</label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ABA: CONTATO E ENDEREÇO */}
            {activeTab === 'contato' && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">CEP (Auto-busca)</label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={zipCode}
                      onBlur={handleZipCodeBlur}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="99999-999"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold">Logradouro / Rua</label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Rua, Avenida, etc."
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">Número</label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Nº"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold">Complemento</label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apto, Bloco, etc."
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">Bairro</label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">Cidade</label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">UF</label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ABA: DOCUMENTAÇÃO */}
            {activeTab === 'documentacao' && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">CPF</label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            )}

            {/* ABA: DADOS CONTRATUAIS */}
            {activeTab === 'contratuais' && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">Cargo / Função</label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="Ex: Costureira"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">Departamento</label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Ex: Produção"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">Data de Admissão</label>
                    <input
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={admissionDate}
                      onChange={(e) => setAdmissionDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">Salário Base (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={salary}
                      onChange={(e) => setSalary(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold">Situação do Contrato</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="ACTIVE">Ativo</option>
                      <option value="ON_LEAVE">Afastado / Licença</option>
                      <option value="TERMINATED">Desligado / Rescindido</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Observações Contratuais</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Benefícios, acordos, termos aditivos..."
                  />
                </div>
              </div>
            )}

            {/* ABA: DADOS BANCÁRIOS */}
            {activeTab === 'bancarios' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Insira as informações de conta bancária para pagamento de folha / salários.
                </p>
                <div className="bg-slate-50 border p-4 rounded-md text-sm text-slate-600">
                  Dados bancários serão criptografados em conformidade com as diretrizes do banco de
                  dados (recurso de segurança ativo).
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/rh')}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Cadastro</Button>
        </div>
      </form>
    </div>
  );
}

export default function NovoFuncionarioPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Carregando formulário...</div>}>
      <FormEmployee />
    </Suspense>
  );
}
