const passosLinks = {
    1: 'passos/passo1.html',
    2: 'passos/passo2.html',
    3: 'passos/passo3.html',
    4: 'passos/passo4.html',
    5: 'passos/passo5.html',
    6: 'passos/passo6.html'
};

// Função para limpar citações de qualquer string HTML
function limparCitacoes(html) {
    return html.replace(/\[cite.*?\]/g, "").replace(/\[cite_start\]/g, "");
}

async function loadStep(num, btn) {
    if (btn) {
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
    }

    try {
        const response = await fetch(passosLinks[num]);
        const htmlRaw = await response.text();
        document.getElementById('display-content').innerHTML = limparCitacoes(htmlRaw);
    } catch (err) {
        document.getElementById('display-content').innerHTML = "<p>Erro ao carregar o conteúdo do passo.</p>";
    }
}

async function generateRobustPDF() {
    // Criar um elemento temporário fora da visão do usuário
    const pdfArea = document.createElement('div');
    pdfArea.style.padding = "20px";
    pdfArea.style.fontFamily = "Arial, sans-serif";
    
    pdfArea.innerHTML = `<h1 style="color:#0054a6; text-align:center;">Manual de Assinatura de Férias - CAERN</h1><hr>`;

    // Carregar todos os passos para compor o manual completo
    for (let i = 1; i <= 6; i++) {
        try {
            const res = await fetch(passosLinks[i]);
            const text = await res.text();
            const stepDiv = document.createElement('div');
            stepDiv.style.marginBottom = "40px";
            stepDiv.style.pageBreakInside = "avoid";
            stepDiv.innerHTML = limparCitacoes(text);
            pdfArea.appendChild(stepDiv);
        } catch (e) {
            console.error("Erro no PDF:", e);
        }
    }

    const opt = {
        margin: [10, 10],
        filename: 'Manual_CAERN_Ferias.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Executa a geração
    html2pdf().set(opt).from(pdfArea).save();
}

window.onload = () => loadStep(1);

