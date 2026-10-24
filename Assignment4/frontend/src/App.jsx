import React, { useState, useEffect } from 'react';

const round2 = (num) => Math.round((Number(num) + Number.EPSILON) * 100) / 100;

export default function App() {
  const [student, setStudent] = useState({
    prn: '12411742',
    studentName: 'shreya',
    branch: 'Computer Engineering',
    semester: 'V',
  });

  const [marks, setMarks] = useState({
    dsaMse: 26,
    dsaEse: 68,
    dbmsMse: 29,
    dbmsEse: 66,
    cnMse: 27,
    cnEse: 67,
    wtMse: 28,
    wtEse: 66,
  });

  const [searchPrn, setSearchPrn] = useState('');
  const [resultData, setResultData] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'toast-info' });

  const showToast = (message, type = 'toast-info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'toast-info' });
    }, 3800);
  };

  const calcSubFinal = (m, e) => {
    const mseVal = parseFloat(m) || 0;
    const eseVal = parseFloat(e) || 0;
    return round2(mseVal * 0.3 + eseVal * 0.7);
  };

  const handleStudentChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleMarksChange = (e) => {
    setMarks({ ...marks, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    const query = searchPrn.trim();
    if (!query) {
      showToast('Please enter a student PRN to search', 'toast-error');
      return;
    }

    try {
      const res = await fetch(`/api/results/${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setStudent({
          prn: data.prn,
          studentName: data.studentName,
          branch: data.branch,
          semester: data.semester,
        });
        setMarks({
          dsaMse: data.dsaMse,
          dsaEse: data.dsaEse,
          dbmsMse: data.dbmsMse,
          dbmsEse: data.dbmsEse,
          cnMse: data.cnMse,
          cnEse: data.cnEse,
          wtMse: data.wtMse,
          wtEse: data.wtEse,
        });
        setResultData(data);
        showToast(`Record found for PRN: ${query}`, 'toast-success');
        return;
      }
    } catch (err) {
      console.warn('Backend unavailable, fallback:', err);
    }

    // Demo fallback for offline test
    if (query === '12411742') {
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
        subjectsCleared: 4, overallStatus: 'PASS',
      };
      setStudent({
        prn: fallback.prn,
        studentName: fallback.studentName,
        branch: fallback.branch,
        semester: fallback.semester,
      });
      setMarks({
        dsaMse: 26, dsaEse: 68,
        dbmsMse: 29, dbmsEse: 66,
        cnMse: 27, cnEse: 67,
        wtMse: 28, wtEse: 66,
      });
      setResultData(fallback);
      showToast(`Demo record loaded for PRN: ${query}`, 'toast-info');
    } else {
      showToast(`No existing result found for PRN: ${query}. You can calculate and save!`, 'toast-info');
    }
  };

  const handleCalculateAndSave = async () => {
    if (!student.prn.trim() || !student.studentName.trim()) {
      showToast('Please enter both PRN and Student Name', 'toast-error');
      return;
    }

    const dsaM = parseFloat(marks.dsaMse) || 0;
    const dsaE = parseFloat(marks.dsaEse) || 0;
    const dbmsM = parseFloat(marks.dbmsMse) || 0;
    const dbmsE = parseFloat(marks.dbmsEse) || 0;
    const cnM = parseFloat(marks.cnMse) || 0;
    const cnE = parseFloat(marks.cnEse) || 0;
    const wtM = parseFloat(marks.wtMse) || 0;
    const wtE = parseFloat(marks.wtEse) || 0;

    if ([dsaM, dbmsM, cnM, wtM].some((v) => v < 0 || v > 30)) {
      showToast('MSE marks must be between 0 and 30', 'toast-error');
      return;
    }
    if ([dsaE, dbmsE, cnE, wtE].some((v) => v < 0 || v > 70)) {
      showToast('ESE marks must be between 0 and 70', 'toast-error');
      return;
    }

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

    const payload = {
      prn: student.prn.trim(),
      studentName: student.studentName.trim(),
      branch: student.branch,
      semester: student.semester,
      dsaMse: dsaM, dsaEse: dsaE, dsaFinal: dFin,
      dbmsMse: dbmsM, dbmsEse: dbmsE, dbmsFinal: dbFin,
      cnMse: cnM, cnEse: cnE, cnFinal: cnFin,
      wtMse: wtM, wtEse: wtE, wtFinal: wtFin,
      grandTotal: total,
      percentage: pct,
      subjectsCleared: cleared,
      overallStatus: cleared === 4 ? 'PASS' : 'FAIL',
    };

    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        setResultData(saved);
        showToast('Result calculated & securely saved to MySQL!', 'toast-success');
        return;
      }
    } catch (err) {
      console.warn('Backend offline, proceeding locally:', err);
    }

    setResultData(payload);
    showToast('Result calculated locally (Spring Boot offline).', 'toast-info');
  };

  const handleReset = () => {
    setStudent({
      prn: '',
      studentName: '',
      branch: 'Computer Engineering',
      semester: 'V',
    });
    setMarks({
      dsaMse: '', dsaEse: '',
      dbmsMse: '', dbmsEse: '',
      cnMse: '', cnEse: '',
      wtMse: '', wtEse: '',
    });
    setSearchPrn('');
    setResultData(null);
    showToast('Form reset to blank state', 'toast-info');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="nav-brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div>
            <div className="brand-title">VIT</div>
            <div className="brand-subtitle">RESULT PORTAL</div>
          </div>
        </div>
        <div className="nav-right">
          Semester Result Management
        </div>
      </header>

      <main className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <div>
            <div className="hero-college">VISHWAKARMA INSTITUTE OF TECHNOLOGY</div>
            <h1 className="hero-title">
              Semester Result <span className="italic-portal">Portal</span>
            </h1>
            <p className="hero-desc">Prepares, calculates and securely store student results with 30% MSE + 70% ESE.</p>
          </div>
          <div className="hero-badge">
            <span className="badge-num">4</span>
            <span className="badge-label">SEMESTER</span>
          </div>
        </section>

        {/* Find Existing Result Card */}
        <section className="card search-card">
          <div className="card-label">FIND EXISTING RESULT</div>
          <div className="search-form-row">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Enter student PRN (e.g. 12411742)"
                value={searchPrn}
                onChange={(e) => setSearchPrn(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button type="button" onClick={handleSearch} className="btn-search">
              Search Result
            </button>
          </div>
        </section>

        {/* 01 Student Information Card */}
        <section className="card" id="formStudentInfo">
          <div className="section-header">
            <div className="section-num">01</div>
            <div>
              <h2 className="section-title">Student Information</h2>
              <p className="section-desc">Enter the basic details of the student</p>
            </div>
          </div>

          <div className="form-grid-4">
            <div className="form-group">
              <label className="form-label" htmlFor="studentPrn">PRN</label>
              <input
                type="text"
                id="studentPrn"
                name="prn"
                className="form-control"
                placeholder="12411742"
                value={student.prn}
                onChange={handleStudentChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="studentName">STUDENT NAME</label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                className="form-control"
                placeholder="Swanand Uttarwar"
                value={student.studentName}
                onChange={handleStudentChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="studentBranch">BRANCH</label>
              <select
                id="studentBranch"
                name="branch"
                className="form-control"
                value={student.branch}
                onChange={handleStudentChange}
              >
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Chemical Engineering">Chemical Engineering</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="studentSemester">SEMESTER</label>
              <select
                id="studentSemester"
                name="semester"
                className="form-control"
                value={student.semester}
                onChange={handleStudentChange}
              >
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
                <option value="V">V</option>
                <option value="VI">VI</option>
                <option value="VII">VII</option>
                <option value="VIII">VIII</option>
              </select>
            </div>
          </div>
        </section>

        {/* 02 Subject Marks Card */}
        <section className="card" id="formMarks">
          <div className="marks-header-flex">
            <div className="section-header" style={{ marginBottom: 0 }}>
              <div className="section-num">02</div>
              <div>
                <h2 className="section-title">Subject Marks</h2>
                <p className="section-desc">Enter MSE out of 30 and ESE out of 70</p>
              </div>
            </div>
            <div className="formula-tag">
              MSE 30% + ESE 70% = Final / 100
            </div>
          </div>

          <table className="marks-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>SUBJECT</th>
                <th style={{ width: '150px' }}>MSE / 30</th>
                <th style={{ width: '150px' }}>ESE / 70</th>
                <th style={{ width: '140px' }}>FINAL / 100</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="sub-index">01</td>
                <td>
                  <div className="sub-name">Data Structures &amp; Algorithms</div>
                  <div className="sub-code">CS301</div>
                </td>
                <td>
                  <input
                    type="number"
                    name="dsaMse"
                    className="input-mark"
                    min="0"
                    max="30"
                    step="0.5"
                    value={marks.dsaMse}
                    onChange={handleMarksChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="dsaEse"
                    className="input-mark"
                    min="0"
                    max="70"
                    step="0.5"
                    value={marks.dsaEse}
                    onChange={handleMarksChange}
                  />
                </td>
                <td>
                  <span className="final-calc">
                    {calcSubFinal(marks.dsaMse, marks.dsaEse).toFixed(2)}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="sub-index">02</td>
                <td>
                  <div className="sub-name">Database Management Systems</div>
                  <div className="sub-code">CS302</div>
                </td>
                <td>
                  <input
                    type="number"
                    name="dbmsMse"
                    className="input-mark"
                    min="0"
                    max="30"
                    step="0.5"
                    value={marks.dbmsMse}
                    onChange={handleMarksChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="dbmsEse"
                    className="input-mark"
                    min="0"
                    max="70"
                    step="0.5"
                    value={marks.dbmsEse}
                    onChange={handleMarksChange}
                  />
                </td>
                <td>
                  <span className="final-calc">
                    {calcSubFinal(marks.dbmsMse, marks.dbmsEse).toFixed(2)}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="sub-index">03</td>
                <td>
                  <div className="sub-name">Computer Networks</div>
                  <div className="sub-code">CS303</div>
                </td>
                <td>
                  <input
                    type="number"
                    name="cnMse"
                    className="input-mark"
                    min="0"
                    max="30"
                    step="0.5"
                    value={marks.cnMse}
                    onChange={handleMarksChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="cnEse"
                    className="input-mark"
                    min="0"
                    max="70"
                    step="0.5"
                    value={marks.cnEse}
                    onChange={handleMarksChange}
                  />
                </td>
                <td>
                  <span className="final-calc">
                    {calcSubFinal(marks.cnMse, marks.cnEse).toFixed(2)}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="sub-index">04</td>
                <td>
                  <div className="sub-name">Web Technology</div>
                  <div className="sub-code">CS304</div>
                </td>
                <td>
                  <input
                    type="number"
                    name="wtMse"
                    className="input-mark"
                    min="0"
                    max="30"
                    step="0.5"
                    value={marks.wtMse}
                    onChange={handleMarksChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="wtEse"
                    className="input-mark"
                    min="0"
                    max="70"
                    step="0.5"
                    value={marks.wtEse}
                    onChange={handleMarksChange}
                  />
                </td>
                <td>
                  <span className="final-calc">
                    {calcSubFinal(marks.wtMse, marks.wtEse).toFixed(2)}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="actions-row">
            <button
              type="button"
              onClick={handleCalculateAndSave}
              className="btn-primary-action"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                <line x1="8" y1="6" x2="16" y2="6"></line>
                <line x1="16" y1="14" x2="16" y2="18"></line>
                <line x1="16" y1="10" x2="16" y2="10.01"></line>
                <line x1="12" y1="10" x2="12" y2="10.01"></line>
                <line x1="8" y1="10" x2="8" y2="10.01"></line>
                <line x1="12" y1="14" x2="12" y2="14.01"></line>
                <line x1="8" y1="14" x2="8" y2="14.01"></line>
                <line x1="12" y1="18" x2="12" y2="18.01"></line>
                <line x1="8" y1="18" x2="8" y2="18.01"></line>
              </svg>
              Calculate &amp; Save Result
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary-action"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              Reset
            </button>
          </div>
        </section>

        {/* Official Semester Result (Dark Card) */}
        {resultData && (
          <section className="dark-result-card" style={{ display: 'block' }}>
            <div className="result-card-header">
              <div>
                <div className="result-eyebrow">OFFICIAL SEMESTER RESULT</div>
                <h2 className="result-student-name">{resultData.studentName}</h2>
                <p className="result-student-meta">
                  {resultData.prn} · {resultData.branch} · Semester {resultData.semester}
                </p>
              </div>
              <div>
                <span className={`status-pill ${resultData.overallStatus === 'PASS' ? 'status-pass' : 'status-fail'}`}>
                  {resultData.overallStatus === 'PASS' ? '✔ PASS' : '✖ FAIL'}
                </span>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="result-stats-grid">
              <div className="stat-item">
                <span className="stat-title">GRAND TOTAL</span>
                <div className="stat-value-group">
                  <span className="stat-big-val">{Number(resultData.grandTotal).toFixed(1)}</span>
                  <span className="stat-sub-val">/ 400</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-title">PERCENTAGE</span>
                <div className="stat-value-group">
                  <span className="stat-big-val">{Number(resultData.percentage).toFixed(2)}</span>
                  <span className="stat-sub-val">%</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-title">SUBJECTS</span>
                <div className="stat-value-group">
                  <span className="stat-big-val">
                    {resultData.subjectsCleared < 10 ? `0${resultData.subjectsCleared}` : resultData.subjectsCleared}
                  </span>
                  <span className="stat-sub-val">cleared</span>
                </div>
              </div>
            </div>

            {/* Detailed Result Table */}
            <table className="dark-result-table">
              <thead>
                <tr>
                  <th>SUBJECT</th>
                  <th style={{ width: '140px' }}>MSE</th>
                  <th style={{ width: '140px' }}>ESE</th>
                  <th style={{ width: '150px' }}>FINAL</th>
                  <th style={{ width: '100px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="subj-title">Data Structures &amp; Algorithms</div>
                    <div className="subj-id">CS301</div>
                  </td>
                  <td>{resultData.dsaMse}/30</td>
                  <td>{resultData.dsaEse}/70</td>
                  <td>{Number(resultData.dsaFinal).toFixed(1)}/100</td>
                  <td>
                    <span className={`badge-subj-status ${resultData.dsaFinal >= 40.0 ? 'pass' : 'fail'}`}>
                      {resultData.dsaFinal >= 40.0 ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="subj-title">Database Management Systems</div>
                    <div className="subj-id">CS302</div>
                  </td>
                  <td>{resultData.dbmsMse}/30</td>
                  <td>{resultData.dbmsEse}/70</td>
                  <td>{Number(resultData.dbmsFinal).toFixed(1)}/100</td>
                  <td>
                    <span className={`badge-subj-status ${resultData.dbmsFinal >= 40.0 ? 'pass' : 'fail'}`}>
                      {resultData.dbmsFinal >= 40.0 ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="subj-title">Computer Networks</div>
                    <div className="subj-id">CS303</div>
                  </td>
                  <td>{resultData.cnMse}/30</td>
                  <td>{resultData.cnEse}/70</td>
                  <td>{Number(resultData.cnFinal).toFixed(0)}/100</td>
                  <td>
                    <span className={`badge-subj-status ${resultData.cnFinal >= 40.0 ? 'pass' : 'fail'}`}>
                      {resultData.cnFinal >= 40.0 ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="subj-title">Web Technology</div>
                    <div className="subj-id">CS304</div>
                  </td>
                  <td>{resultData.wtMse}/30</td>
                  <td>{resultData.wtEse}/70</td>
                  <td>{Number(resultData.wtFinal).toFixed(1)}/100</td>
                  <td>
                    <span className={`badge-subj-status ${resultData.wtFinal >= 40.0 ? 'pass' : 'fail'}`}>
                      {resultData.wtFinal >= 40.0 ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div>
              <button type="button" onClick={handlePrint} className="btn-print">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Print / Save Result
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Toast Notification */}
      <div className={`toast-msg ${toast.type} ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>
    </>
  );
}
