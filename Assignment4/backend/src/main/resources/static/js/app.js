// VIT Semester Result Portal Client Script

document.addEventListener('DOMContentLoaded', () => {
    // Subject Marks Inputs
    const dsaMse = document.getElementById('dsaMse');
    const dsaEse = document.getElementById('dsaEse');
    const dsaFinal = document.getElementById('dsaFinal');

    const dbmsMse = document.getElementById('dbmsMse');
    const dbmsEse = document.getElementById('dbmsEse');
    const dbmsFinal = document.getElementById('dbmsFinal');

    const cnMse = document.getElementById('cnMse');
    const cnEse = document.getElementById('cnEse');
    const cnFinal = document.getElementById('cnFinal');

    const wtMse = document.getElementById('wtMse');
    const wtEse = document.getElementById('wtEse');
    const wtFinal = document.getElementById('wtFinal');

    // Student Info
    const studentPrn = document.getElementById('studentPrn');
    const studentName = document.getElementById('studentName');
    const studentBranch = document.getElementById('studentBranch');
    const studentSemester = document.getElementById('studentSemester');

    // Search
    const searchPrn = document.getElementById('searchPrn');
    const btnSearch = document.getElementById('btnSearch');

    // Actions
    const btnCalculateSave = document.getElementById('btnCalculateSave');
    const btnReset = document.getElementById('btnReset');
    const btnPrint = document.getElementById('btnPrint');

    // Result Card Elements
    const darkResultCard = document.getElementById('darkResultCard');
    const resStudentName = document.getElementById('resStudentName');
    const resStudentMeta = document.getElementById('resStudentMeta');
    const resStatusPill = document.getElementById('resStatusPill');
    const resGrandTotal = document.getElementById('resGrandTotal');
    const resPercentage = document.getElementById('resPercentage');
    const resClearedCount = document.getElementById('resClearedCount');

    // Result Table Cells
    const resDsaMse = document.getElementById('resDsaMse');
    const resDsaEse = document.getElementById('resDsaEse');
    const resDsaFinal = document.getElementById('resDsaFinal');
    const resDsaStatus = document.getElementById('resDsaStatus');

    const resDbmsMse = document.getElementById('resDbmsMse');
    const resDbmsEse = document.getElementById('resDbmsEse');
    const resDbmsFinal = document.getElementById('resDbmsFinal');
    const resDbmsStatus = document.getElementById('resDbmsStatus');

    const resCnMse = document.getElementById('resCnMse');
    const resCnEse = document.getElementById('resCnEse');
    const resCnFinal = document.getElementById('resCnFinal');
    const resCnStatus = document.getElementById('resCnStatus');

    const resWtMse = document.getElementById('resWtMse');
    const resWtEse = document.getElementById('resWtEse');
    const resWtFinal = document.getElementById('resWtFinal');
    const resWtStatus = document.getElementById('resWtStatus');

    // Helper: Round to 2 decimals
    const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

    // Helper: Compute single subject final
    const calcSubFinal = (mseVal, eseVal) => {
        const m = parseFloat(mseVal) || 0;
        const e = parseFloat(eseVal) || 0;
        return round2((m * 0.30) + (e * 0.70));
    };

    // Live update final mark in form table
    const updateLiveRow = (mseInput, eseInput, finalEl) => {
        const fin = calcSubFinal(mseInput.value, eseInput.value);
        finalEl.textContent = fin.toFixed(2);
    };

    const attachLiveCalc = () => {
        [
            [dsaMse, dsaEse, dsaFinal],
            [dbmsMse, dbmsEse, dbmsFinal],
            [cnMse, cnEse, cnFinal],
            [wtMse, wtEse, wtFinal]
        ].forEach(([mInput, eInput, fEl]) => {
            const listener = () => updateLiveRow(mInput, eInput, fEl);
            mInput.addEventListener('input', listener);
            eInput.addEventListener('input', listener);
        });
    };

    attachLiveCalc();

    // Render Official Result Card
    const displayResult = (data) => {
        resStudentName.textContent = data.studentName;
        resStudentMeta.textContent = `${data.prn} · ${data.branch} · Semester ${data.semester}`;

        const isPass = data.overallStatus === 'PASS';
        resStatusPill.className = `status-pill ${isPass ? 'status-pass' : 'status-fail'}`;
        resStatusPill.innerHTML = isPass ? '&#10004; PASS' : '&#10006; FAIL';

        resGrandTotal.textContent = Number(data.grandTotal).toFixed(1);
        resPercentage.textContent = Number(data.percentage).toFixed(2);
        resClearedCount.textContent = data.subjectsCleared < 10 ? `0${data.subjectsCleared}` : data.subjectsCleared;

        // Subject 1
        resDsaMse.textContent = `${data.dsaMse}/30`;
        resDsaEse.textContent = `${data.dsaEse}/70`;
        resDsaFinal.textContent = `${Number(data.dsaFinal).toFixed(1)}/100`;
        setSubStatusBadge(resDsaStatus, data.dsaFinal >= 40.0);

        // Subject 2
        resDbmsMse.textContent = `${data.dbmsMse}/30`;
        resDbmsEse.textContent = `${data.dbmsEse}/70`;
        resDbmsFinal.textContent = `${Number(data.dbmsFinal).toFixed(1)}/100`;
        setSubStatusBadge(resDbmsStatus, data.dbmsFinal >= 40.0);

        // Subject 3
        resCnMse.textContent = `${data.cnMse}/30`;
        resCnEse.textContent = `${data.cnEse}/70`;
        resCnFinal.textContent = `${Number(data.cnFinal).toFixed(0)}/100`;
        setSubStatusBadge(resCnStatus, data.cnFinal >= 40.0);

        // Subject 4
        resWtMse.textContent = `${data.wtMse}/30`;
        resWtEse.textContent = `${data.wtEse}/70`;
        resWtFinal.textContent = `${Number(data.wtFinal).toFixed(1)}/100`;
        setSubStatusBadge(resWtStatus, data.wtFinal >= 40.0);

        darkResultCard.style.display = 'block';
        darkResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    const setSubStatusBadge = (el, passed) => {
        el.className = `badge-subj-status ${passed ? 'pass' : 'fail'}`;
        el.textContent = passed ? 'PASS' : 'FAIL';
    };

    // API URL (relative works for Spring Boot static or proxy, fallback to absolute)
    const API_BASE = window.location.port === '5173' ? 'http://localhost:8080/api/results' : '/api/results';

    // Search Result
    const handleSearch = async () => {
        const prn = (searchPrn.value || '').trim();
        if (!prn) {
            showToast('Please enter a student PRN to search', 'toast-error');
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/${encodeURIComponent(prn)}`);
            if (res.ok) {
                const data = await res.json();
                // Populate Form
                studentPrn.value = data.prn;
                studentName.value = data.studentName;
                studentBranch.value = data.branch;
                studentSemester.value = data.semester;

                dsaMse.value = data.dsaMse;
                dsaEse.value = data.dsaEse;
                updateLiveRow(dsaMse, dsaEse, dsaFinal);

                dbmsMse.value = data.dbmsMse;
                dbmsEse.value = data.dbmsEse;
                updateLiveRow(dbmsMse, dbmsEse, dbmsFinal);

                cnMse.value = data.cnMse;
                cnEse.value = data.cnEse;
                updateLiveRow(cnMse, cnEse, cnFinal);

                wtMse.value = data.wtMse;
                wtEse.value = data.wtEse;
                updateLiveRow(wtMse, wtEse, wtFinal);

                displayResult(data);
                showToast(`Record found for PRN: ${prn}`, 'toast-success');
            } else {
                // If not found in backend or offline, check demo fallbacks
                if (prn.toUpperCase() === '12411742') {
                    const fallback = {
                        prn: '12411742',
                        studentName: 'swanand',
                        branch: 'Computer Engineering',
                        semester: 'V',
                        dsaMse: 26, dsaEse: 68, dsaFinal: 55.4,
                        dbmsMse: 29, dbmsEse: 66, dbmsFinal: 54.9,
                        cnMse: 27, cnEse: 67, cnFinal: 55.0,
                        wtMse: 28, wtEse: 66, wtFinal: 54.6,
                        grandTotal: 219.9, percentage: 54.98,
                        subjectsCleared: 4, overallStatus: 'PASS'
                    };
                    studentPrn.value = fallback.prn;
                    studentName.value = fallback.studentName;
                    studentBranch.value = fallback.branch;
                    studentSemester.value = fallback.semester;
                    dsaMse.value = 26; dsaEse = 68; updateLiveRow(dsaMse, dsaEse, dsaFinal);
                    dbmsMse.value = 29; dbmsEse = 66; updateLiveRow(dbmsMse, dbmsEse, dbmsFinal);
                    cnMse.value = 27; cnEse = 67; updateLiveRow(cnMse, cnEse, cnFinal);
                    wtMse.value = 28; wtEse = 66; updateLiveRow(wtMse, wtEse, wtFinal);
                    displayResult(fallback);
                    showToast(`Demo record loaded for PRN: ${prn}`, 'toast-info');
                    return;
                }
                showToast(`No existing result found for PRN: ${prn}. You can enter details and save!`, 'toast-info');
            }
        } catch (err) {
            console.warn('API fetch error, using local computation:', err);
            showToast('Note: Spring Boot backend is not connected. Local mode enabled.', 'toast-info');
        }
    };

    btnSearch.addEventListener('click', handleSearch);
    searchPrn.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Calculate & Save Result
    btnCalculateSave.addEventListener('click', async () => {
        const prn = (studentPrn.value || '').trim();
        const name = (studentName.value || '').trim();
        const branch = studentBranch.value;
        const sem = studentSemester.value;

        if (!prn || !name) {
            showToast('Please enter both PRN and Student Name', 'toast-error');
            return;
        }

        const dsaM = parseFloat(dsaMse.value) || 0;
        const dsaE = parseFloat(dsaEse.value) || 0;
        const dbmsM = parseFloat(dbmsMse.value) || 0;
        const dbmsE = parseFloat(dbmsEse.value) || 0;
        const cnM = parseFloat(cnMse.value) || 0;
        const cnE = parseFloat(cnEse.value) || 0;
        const wtM = parseFloat(wtMse.value) || 0;
        const wtE = parseFloat(wtEse.value) || 0;

        // Validation limits
        if ([dsaM, dbmsM, cnM, wtM].some(v => v < 0 || v > 30)) {
            showToast('MSE marks must be between 0 and 30', 'toast-error');
            return;
        }
        if ([dsaE, dbmsE, cnE, wtE].some(v => v < 0 || v > 70)) {
            showToast('ESE marks must be between 0 and 70', 'toast-error');
            return;
        }

        // Local computation
        const dFin = calcSubFinal(dsaM, dsaE);
        const dbFin = calcSubFinal(dbmsM, dbmsE);
        const cnFin = calcSubFinal(cnM, cnE);
        const wtFin = calcSubFinal(wtM, wtE);

        const total = round2(dFin + dbFin + cnFin + wtFin);
        const pct = round2(total / 4.0);
        let cleared = 0;
        if (dFin >= 40.0) cleared++;
        if (dbFin >= 40.0) cleared++;
        if (cnFin >= 40.0) cleared++;
        if (wtFin >= 40.0) cleared++;

        const computedData = {
            prn: prn,
            studentName: name,
            branch: branch,
            semester: sem,
            dsaMse: dsaM, dsaEse: dsaE, dsaFinal: dFin,
            dbmsMse: dbmsM, dbmsEse: dbmsE, dbmsFinal: dbFin,
            cnMse: cnM, cnEse: cnE, cnFinal: cnFin,
            wtMse: wtM, wtEse: wtE, wtFinal: wtFin,
            grandTotal: total,
            percentage: pct,
            subjectsCleared: cleared,
            overallStatus: cleared === 4 ? 'PASS' : 'FAIL'
        };

        // Try persisting to Spring Boot MySQL backend
        try {
            const response = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(computedData)
            });

            if (response.ok) {
                const savedData = await response.json();
                displayResult(savedData);
                showToast('Result calculated & saved to MySQL database successfully!', 'toast-success');
                return;
            }
        } catch (err) {
            console.warn('Backend save unavailable, showing computed result locally:', err);
        }

        // Fallback display if backend is offline
        displayResult(computedData);
        showToast('Result calculated successfully (Offline mode).', 'toast-info');
    });

    // Reset Form
    btnReset.addEventListener('click', () => {
        studentPrn.value = '';
        studentName.value = '';
        searchPrn.value = '';
        studentBranch.selectedIndex = 0;
        studentSemester.selectedIndex = 4; // Semester V

        [dsaMse, dsaEse, dbmsMse, dbmsEse, cnMse, cnEse, wtMse, wtEse].forEach(input => input.value = '');
        [dsaFinal, dbmsFinal, cnFinal, wtFinal].forEach(el => el.textContent = '0.00');

        darkResultCard.style.display = 'none';
        showToast('Form reset to blank state', 'toast-info');
    });

    // Print
    btnPrint.addEventListener('click', () => {
        window.print();
    });

    // Toast notification
    function showToast(message, type = 'toast-info') {
        const toast = document.getElementById('toastMsg');
        toast.textContent = message;
        toast.className = `toast-msg ${type} show`;
        setTimeout(() => {
            toast.className = 'toast-msg';
        }, 3800);
    }
});
