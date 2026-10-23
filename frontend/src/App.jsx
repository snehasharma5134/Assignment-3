import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import {
  LayoutDashboard,
  Users,
  ChartNoAxesCombined,
  BrainCircuit,
  Settings,
  Search,
  Bell,
  ArrowUpRight,
  Wallet,
  Target,
  Sparkles,
  ChevronRight,
  CircleHelp,
  Menu,
  Activity,
  Zap,
  ArrowLeft,
} from 'lucide-react'
import './App.css'

const COLORS = ['#9b8cff', '#42d9c8', '#ffb86b', '#ff7eaa', '#73a9ff']

const NAMES = [
  'Average Spenders',
  'Premium Customers',
  'Young Enthusiasts',
  'Careful Customers',
  'Budget Conscious',
]

const TYPES = [
  'Balanced customers',
  'High income · High spend',
  'Lower income · High spend',
  'High income · Low spend',
  'Lower income · Low spend',
]

const API = 'http://127.0.0.1:8000'

function CustomerTable({ rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '12px',
          minWidth: '650px',
        }}
      >
        <thead>
          <tr>
            {[
              'ID',
              'Gender',
              'Age',
              'Income (k$)',
              'Spending Score',
              'Cluster',
            ].map((heading) => (
              <th
                key={heading}
                style={{
                  padding: '14px 10px',
                  textAlign: 'left',
                  borderBottom: '1px solid #273044',
                  color: '#9b8cff',
                  whiteSpace: 'nowrap',
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((customer) => (
            <tr key={customer.CustomerID}>
              <td style={cellStyle}>{customer.CustomerID}</td>
              <td style={cellStyle}>{customer.Gender}</td>
              <td style={cellStyle}>{customer.Age}</td>
              <td style={cellStyle}>
                {customer['Annual Income (k$)']}
              </td>
              <td style={cellStyle}>
                {customer['Spending Score (1-100)']}
              </td>
              <td style={cellStyle}>
                Cluster {customer.Cluster}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="panel-description" style={{ marginTop: 16 }}>
        Showing {rows.length} customer record{rows.length === 1 ? '' : 's'}
      </p>

      {rows.length === 0 && (
        <p className="empty-state">
          No matching customers found. Try another search.
        </p>
      )}
    </div>
  )
}

const SEARCH_FIELDS = [
  'Customer ID',
  'Gender',
  'Age',
  'Annual Income',
  'Spending Score',
  'Cluster',
]

function CustomerSearch({
  query,
  setQuery,
  searchField,
  setSearchField,
  placeholder = 'Enter a value to search...',
}) {
  return (
    <div className="search-box" style={{ gap: 8, minWidth: 0 }}>
      <Search size={16} />
      <select
        aria-label="Search field"
        value={searchField}
        onChange={(event) => setSearchField(event.target.value)}
        style={{
          maxWidth: 150,
          minWidth: 110,
          border: 0,
          outline: 'none',
          background: 'transparent',
          color: '#e5eaf5',
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        {SEARCH_FIELDS.map((field) => (
          <option
            key={field}
            value={field}
            style={{ background: '#151d2d', color: '#e5eaf5' }}
          >
            {field}
          </option>
        ))}
      </select>
      <input
        aria-label={`Search by ${searchField}`}
        placeholder={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label="Clear search"
          style={{
            border: 0,
            background: 'transparent',
            color: '#9b8cff',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}

const cellStyle = {
  padding: '12px 10px',
  borderBottom: '1px solid #202a3c',
  color: '#e5eaf5',
  whiteSpace: 'nowrap',
}

function App() {
  const [active, setActive] = useState('Overview')
  const [income, setIncome] = useState('50')
  const [spending, setSpending] = useState('70')
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [searchField, setSearchField] = useState('Customer ID')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [customers, setCustomers] = useState([])
  const [profiles, setProfiles] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState('')
  const [selectedCluster, setSelectedCluster] = useState(null)

  // Load real customer records and cluster summaries from FastAPI.
  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        setDataLoading(true)
        setDataError('')

        const [customerResponse, clusterResponse] = await Promise.all([
          fetch(`${API}/customers`),
          fetch(`${API}/clusters`),
        ])

        if (!customerResponse.ok || !clusterResponse.ok) {
          throw new Error(
            'Could not load data. Check the backend API endpoints.',
          )
        }

        const customerData = await customerResponse.json()
        const clusterData = await clusterResponse.json()

        if (!Array.isArray(customerData) || !Array.isArray(clusterData)) {
          throw new Error('The backend returned an unexpected data format.')
        }

        if (cancelled) return

        setCustomers(customerData)

        setProfiles(
          clusterData.map((cluster) => {
            const id = Number(cluster.Cluster)

            return {
              id,
              name: NAMES[id] ?? `Cluster ${id}`,
              count: Number(cluster.customer_count),
              income: Number(cluster.average_income),
              spending: Number(cluster.average_spending),
              type: TYPES[id] ?? 'Customer segment',
              color: COLORS[id % COLORS.length],
            }
          }),
        )
      } catch (err) {
        if (!cancelled) {
          setDataError(
            err.message ||
              'Unable to load customer and cluster data.',
          )
        }
      } finally {
        if (!cancelled) setDataLoading(false)
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [])

  const totalCustomers = customers.length

  const scatterData = useMemo(
    () =>
      customers.map((customer) => ({
        x: Number(customer['Annual Income (k$)']),
        y: Number(customer['Spending Score (1-100)']),
        cluster: Number(customer.Cluster),
        customerId: customer.CustomerID,
      })),
    [customers],
  )

  // Search the segment cards on the Overview page.
  const filteredProfiles = profiles.filter((profile) =>
    `${profile.name} ${profile.type} ${profile.id}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  )

  // Search exactly within the field selected by the user.
  const filteredCustomers = useMemo(() => {
    const search = query.trim()
    if (!search) return customers

    return customers.filter((customer) => {
      const fields = {
        'Customer ID': customer.CustomerID,
        Gender: customer.Gender,
        Age: customer.Age,
        'Annual Income': customer['Annual Income (k$)'],
        'Spending Score': customer['Spending Score (1-100)'],
        Cluster: customer.Cluster,
      }

      const actualValue = fields[searchField]
      if (searchField === 'Gender') {
        return (
          String(actualValue ?? '').trim().toLowerCase() ===
          search.toLowerCase()
        )
      }

      const searchNumber = Number(search)
      if (!Number.isFinite(searchNumber)) return false
      return Number(actualValue) === searchNumber
    })
  }, [customers, query, searchField])

  const clusterCustomers = useMemo(
    () =>
      customers.filter(
        (customer) =>
          Number(customer.Cluster) === Number(selectedCluster),
      ),
    [customers, selectedCluster],
  )

  const filteredClusterCustomers = useMemo(() => {
    const search = query.trim()
    if (!search) return clusterCustomers

    return clusterCustomers.filter((customer) => {
      const fields = {
        'Customer ID': customer.CustomerID,
        Gender: customer.Gender,
        Age: customer.Age,
        'Annual Income': customer['Annual Income (k$)'],
        'Spending Score': customer['Spending Score (1-100)'],
        Cluster: customer.Cluster,
      }

      const actualValue = fields[searchField]
      if (searchField === 'Gender') {
        return (
          String(actualValue ?? '').trim().toLowerCase() ===
          search.toLowerCase()
        )
      }

      const searchNumber = Number(search)
      if (!Number.isFinite(searchNumber)) return false
      return Number(actualValue) === searchNumber
    })
  }, [clusterCustomers, query, searchField])

  function changePage(label) {
    setActive(label)
    setMobileMenu(false)
    setQuery('')
    setSelectedCluster(null)
  }

  function openCluster(id) {
    setSelectedCluster(Number(id))
    setActive('Clusters')
    setQuery('')
    setMobileMenu(false)
  }

  async function predictCustomer(event) {
    event.preventDefault()
    setLoading(true)
    setPrediction(null)
    setError('')

    try {
      const response = await fetch(`${API}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annual_income: Number(income),
          spending_score: Number(spending),
        }),
      })

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      const result = await response.json()

      const profile = profiles.find(
        (item) => item.id === Number(result.predicted_cluster),
      )

      setPrediction({
        ...result,
        name: profile?.name ?? `Cluster ${result.predicted_cluster}`,
        type: profile?.type ?? 'Predicted customer segment',
        color: profile?.color ?? COLORS[0],
      })
    } catch {
      setError(
        'Could not connect to the API. Check that FastAPI is running at http://127.0.0.1:8000.',
      )
    } finally {
      setLoading(false)
    }
  }

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Clusters', icon: ChartNoAxesCombined },
    { label: 'Customers', icon: Users },
    { label: 'Predict Segment', icon: BrainCircuit },
  ]

  const subtitle =
    active === 'Overview'
      ? 'Discover patterns, understand spending behaviour, and make smarter decisions.'
      : active === 'Clusters'
        ? 'Explore customer groups identified by your K-Means model.'
        : active === 'Customers'
          ? 'Explore individual customer records in your dataset.'
          : 'Predict the customer segment for a new customer.'

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <BrainCircuit size={23} />
          </div>
          <div>
            <div className="brand-name">ClusterIQ</div>
            <div className="brand-caption">INTELLIGENCE STUDIO</div>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="nav-list">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${active === label ? 'nav-active' : ''}`}
              onClick={() => changePage(label)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active === label && <span className="active-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-divider" />
        <div className="workspace-label">PREFERENCES</div>

        <button
          className="nav-item"
          onClick={() => alert('Settings will be added in a future step.')}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button
          className="nav-item"
          onClick={() => alert('Help documentation will be added in a future step.')}
        >
          <CircleHelp size={18} />
          <span>Help &amp; support</span>
        </button>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Sparkles size={18} />
            </div>
            <strong>Smarter insights</strong>
            <p>Turn customer data into meaningful segments.</p>
            <span className="upgrade-tag">ML POWERED</span>
          </div>

          <div className="profile-mini">
            <div className="avatar">S</div>
            <div className="profile-info">
              <strong>Workspace</strong>
              <span>ML Analyst</span>
            </div>
            <Settings size={16} className="profile-settings" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumbs">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{active}</strong>
          </div>

          <div className="topbar-right">
            <div className="system-status">
              <span className="status-dot" />
              ML workspace
            </div>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={18} />
              <i />
            </button>
            <div className="avatar top-avatar">S</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <Sparkles size={14} /> CUSTOMER INTELLIGENCE
              </div>
              <h1>
                {active === 'Overview' ? 'Know your customers.' : active}
              </h1>
              <p className="page-subtitle">{subtitle}</p>
            </div>

            <div className="date-chip">
              <Activity size={15} /> K-MEANS ANALYTICS{' '}
              <span className="date-dot" />
            </div>
          </section>

          {dataError && <div className="error-message">{dataError}</div>}

          {dataLoading && (
            <p className="panel-description">
              Loading customer and cluster data from the API...
            </p>
          )}

          {/* OVERVIEW PAGE */}
          {!dataLoading && !dataError && active === 'Overview' && (
            <>
              <section className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-top">
                    <span>Total customers</span>
                    <div className="metric-icon purple">
                      <Users size={19} />
                    </div>
                  </div>
                  <div className="metric-value">
                    {totalCustomers.toLocaleString()}
                  </div>
                  <div className="metric-foot">
                    <span className="metric-dot purple-dot" />
                    Customers in dataset
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-top">
                    <span>Customer segments</span>
                    <div className="metric-icon teal">
                      <Target size={19} />
                    </div>
                  </div>
                  <div className="metric-value">
                    {profiles.length.toString().padStart(2, '0')}{' '}
                    <span className="value-caption">clusters</span>
                  </div>
                  <div className="metric-foot">
                    <span className="metric-dot teal-dot" />
                    K-Means segmentation
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-top">
                    <span>Silhouette score</span>
                    <div className="metric-icon orange">
                      <ChartNoAxesCombined size={19} />
                    </div>
                  </div>
                  <div className="metric-value">0.555</div>
                  <div className="metric-foot">
                    <span className="metric-dot orange-dot" />
                    Model evaluation result
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-top">
                    <span>Features used</span>
                    <div className="metric-icon pink">
                      <Activity size={19} />
                    </div>
                  </div>
                  <div className="metric-value">
                    02 <span className="value-caption">features</span>
                  </div>
                  <div className="metric-foot">
                    <span className="metric-dot pink-dot" />
                    Income + spending score
                  </div>
                </div>
              </section>

              <section className="visual-grid">
                <div className="panel scatter-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="section-kicker">BEHAVIOUR MAP</span>
                      <h2>Customer cluster distribution</h2>
                      <p className="panel-description">
                        Annual income vs. spending score
                      </p>
                    </div>
                    <span className="chart-badge">
                      <span className="status-dot" /> {profiles.length} segments
                    </span>
                  </div>

                  <div className="chart-area">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 12, right: 16, bottom: 12, left: 0 }}
                      >
                        <CartesianGrid
                          stroke="#273044"
                          strokeDasharray="3 5"
                        />
                        <XAxis
                          type="number"
                          dataKey="x"
                          name="Income (k$)"
                          domain={[0, 'auto']}
                          tick={{ fill: '#8f9bb0', fontSize: 11 }}
                          axisLine={{ stroke: '#344055' }}
                          tickLine={false}
                          label={{
                            value: 'Annual income (k$)',
                            position: 'insideBottom',
                            offset: -4,
                            fill: '#8f9bb0',
                            fontSize: 11,
                          }}
                        />
                        <YAxis
                          type="number"
                          dataKey="y"
                          name="Spending score"
                          domain={[0, 100]}
                          tick={{ fill: '#8f9bb0', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{
                            background: '#151d2d',
                            border: '1px solid #344055',
                            borderRadius: 10,
                            color: '#f3f5fb',
                          }}
                          formatter={(value, name) => [value, name]}
                          labelFormatter={(_, payload) =>
                            payload?.[0]?.payload?.customerId
                              ? `Customer ID: ${payload[0].payload.customerId}`
                              : ''
                          }
                        />
                        {profiles.map((profile) => (
                          <Scatter
                            key={profile.id}
                            name={`Cluster ${profile.id}`}
                            data={scatterData.filter(
                              (point) => point.cluster === profile.id,
                            )}
                            fill={profile.color}
                          />
                        ))}
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-legend">
                    {profiles.map((profile) => (
                      <span key={profile.id}>
                        <i style={{ background: profile.color }} />
                        Cluster {profile.id}
                      </span>
                    ))}
                  </div>

                  <div className="preview-notice">
                    Each point represents a real customer record returned by
                    the backend API.
                  </div>
                </div>

                <div className="panel distribution-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="section-kicker">SEGMENT SIZE</span>
                      <h2>Customer distribution</h2>
                      <p className="panel-description">
                        Customers in each cluster
                      </p>
                    </div>
                  </div>

                  <div className="bar-chart-area">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={profiles}
                        margin={{ top: 14, right: 4, bottom: 0, left: -20 }}
                      >
                        <CartesianGrid
                          stroke="#273044"
                          strokeDasharray="3 5"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="id"
                          tickFormatter={(value) => `C${value}`}
                          tick={{ fill: '#8f9bb0', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: '#8f9bb0', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: '#151d2d',
                            border: '1px solid #344055',
                            borderRadius: 10,
                            color: '#f3f5fb',
                          }}
                          formatter={(value) => [value, 'Customers']}
                          labelFormatter={(value) => `Cluster ${value}`}
                        />
                        <Bar
                          dataKey="count"
                          radius={[5, 5, 0, 0]}
                          barSize={27}
                        >
                          {profiles.map((profile) => (
                            <Cell key={profile.id} fill={profile.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="distribution-total">
                    <span>Total customers</span>
                    <strong>{totalCustomers}</strong>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => changePage('Clusters')}
                  >
                    Explore all segments <ArrowUpRight size={15} />
                  </button>
                </div>
              </section>

              <section className="panel clusters-panel">
                <div className="panel-heading cluster-heading">
                  <div>
                    <span className="section-kicker">
                      SEGMENT INTELLIGENCE
                    </span>
                    <h2>Explore customer segments</h2>
                    <p className="panel-description">
                      Select a segment to inspect its customers.
                    </p>
                  </div>

                  <div className="search-box">
                    <Search size={16} />
                    <input
                      placeholder="Search segments..."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </div>
                </div>

                <div className="cluster-cards">
                  {filteredProfiles.map((profile) => (
                    <button
                      className="cluster-card"
                      key={profile.id}
                      onClick={() => openCluster(profile.id)}
                      style={{ '--segment-color': profile.color }}
                    >
                      <div className="cluster-card-top">
                        <span className="cluster-symbol">C{profile.id}</span>
                        <ArrowUpRight size={17} />
                      </div>
                      <h3>{profile.name}</h3>
                      <p>{profile.type}</p>

                      <div className="cluster-card-stats">
                        <div>
                          <span>Customers</span>
                          <strong>{profile.count}</strong>
                        </div>
                        <div>
                          <span>Avg. income</span>
                          <strong>${profile.income.toFixed(1)}k</strong>
                        </div>
                        <div>
                          <span>Avg. spend</span>
                          <strong>{profile.spending.toFixed(1)}</strong>
                        </div>
                      </div>

                      <div className="segment-progress">
                        <span
                          style={{
                            width: `${
                              totalCustomers
                                ? (profile.count / totalCustomers) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>

                      <div className="segment-share">
                        {totalCustomers
                          ? (
                              (profile.count / totalCustomers) *
                              100
                            ).toFixed(1)
                          : '0.0'}
                        % of customers
                      </div>
                    </button>
                  ))}
                </div>

                {filteredProfiles.length === 0 && (
                  <p className="empty-state">No matching segments found.</p>
                )}
              </section>
            </>
          )}

          {/* CUSTOMERS PAGE */}
          {!dataLoading && !dataError && active === 'Customers' && (
            <section className="panel clusters-panel customer-extra">
              <div className="panel-heading cluster-heading">
                <div>
                  <span className="section-kicker">CUSTOMER DATA</span>
                  <h2>All Customers</h2>
                  <p className="panel-description">
                    Choose a field, then enter the exact value you want to find.
                  </p>
                </div>

                <CustomerSearch
                  query={query}
                  setQuery={setQuery}
                  searchField={searchField}
                  setSearchField={setSearchField}
                  placeholder="Enter exact value..."
                />
              </div>

              <CustomerTable rows={filteredCustomers} />
            </section>
          )}

          {/* CLUSTERS PAGE */}
          {!dataLoading && !dataError && active === 'Clusters' && (
            <>
              {selectedCluster === null ? (
                <section className="panel clusters-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="section-kicker">
                        SEGMENT INTELLIGENCE
                      </span>
                      <h2>Explore the {profiles.length} clusters</h2>
                      <p className="panel-description">
                        Click a cluster card to see its customer records.
                      </p>
                    </div>
                  </div>

                  <div className="cluster-cards">
                    {profiles.map((profile) => (
                      <button
                        className="cluster-card"
                        key={profile.id}
                        onClick={() => openCluster(profile.id)}
                        style={{ '--segment-color': profile.color }}
                      >
                        <div className="cluster-card-top">
                          <span className="cluster-symbol">C{profile.id}</span>
                          <ArrowUpRight size={17} />
                        </div>
                        <h3>{profile.name}</h3>
                        <p>{profile.type}</p>

                        <div className="cluster-card-stats">
                          <div>
                            <span>Customers</span>
                            <strong>{profile.count}</strong>
                          </div>
                          <div>
                            <span>Avg. income</span>
                            <strong>${profile.income.toFixed(1)}k</strong>
                          </div>
                          <div>
                            <span>Avg. spend</span>
                            <strong>{profile.spending.toFixed(1)}</strong>
                          </div>
                        </div>

                        <div className="segment-progress">
                          <span
                            style={{
                              width: `${
                                totalCustomers
                                  ? (profile.count / totalCustomers) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>

                        <div className="segment-share">
                          {totalCustomers
                            ? (
                                (profile.count / totalCustomers) *
                                100
                              ).toFixed(1)
                            : '0.0'}
                          % of customers
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="panel clusters-panel customer-extra">
                  <div className="panel-heading cluster-heading">
                    <div>
                      <span className="section-kicker">CLUSTER DETAILS</span>
                      <h2>
                        Cluster {selectedCluster}:{' '}
                        {
                          profiles.find(
                            (profile) => profile.id === selectedCluster,
                          )?.name
                        }
                      </h2>
                      <p className="panel-description">
                        {
                          profiles.find(
                            (profile) => profile.id === selectedCluster,
                          )?.type
                        }{' '}
                        · {clusterCustomers.length} customers
                      </p>
                    </div>

                    <button
                      className="text-button"
                      onClick={() => setSelectedCluster(null)}
                    >
                      <ArrowLeft size={15} /> All clusters
                    </button>
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <CustomerSearch
                      query={query}
                      setQuery={setQuery}
                      searchField={searchField}
                      setSearchField={setSearchField}
                      placeholder="Enter exact value..."
                    />
                  </div>

                  <CustomerTable rows={filteredClusterCustomers} />

                  <button
                    className="primary-button"
                    style={{ marginTop: 18 }}
                    onClick={() => changePage('Predict Segment')}
                  >
                    Predict another customer <ArrowUpRight size={16} />
                  </button>
                </section>
              )}
            </>
          )}

          {/* PREDICT SEGMENT PAGE */}
          {!dataLoading &&
            !dataError &&
            active === 'Predict Segment' && (
              <section className="prediction-layout">
                <div className="panel prediction-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="section-kicker">LIVE INFERENCE</span>
                      <h2>Customer profile</h2>
                    </div>
                    <div className="heading-icon">
                      <BrainCircuit size={21} />
                    </div>
                  </div>

                  <p className="panel-description">
                    Enter the customer's details to identify their segment
                    using your trained ML model.
                  </p>

                  <form
                    onSubmit={predictCustomer}
                    className="prediction-form"
                  >
                    <label htmlFor="income">
                      Annual income <span>(in $1,000s)</span>
                    </label>
                    <div className="input-wrap">
                      <Wallet size={17} />
                      <input
                        id="income"
                        type="number"
                        min="0"
                        max="200"
                        step="0.1"
                        required
                        value={income}
                        onChange={(event) => setIncome(event.target.value)}
                      />
                      <span className="input-unit">k$</span>
                    </div>
                    <div className="input-hint">
                      Example: 50 means an annual income of $50,000.
                    </div>

                    <label htmlFor="spending">
                      Spending score <span>(1–100)</span>
                    </label>
                    <div className="input-wrap">
                      <Target size={17} />
                      <input
                        id="spending"
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={spending}
                        onChange={(event) => setSpending(event.target.value)}
                      />
                      <span className="input-unit">/ 100</span>
                    </div>
                    <div className="input-hint">
                      A score that represents the customer's spending
                      behaviour.
                    </div>

                    <button
                      className="primary-button predict-button"
                      type="submit"
                      disabled={loading}
                    >
                      <Sparkles size={17} />
                      {loading
                        ? 'Analysing customer...'
                        : 'Predict customer segment'}
                      <ArrowUpRight size={17} />
                    </button>
                  </form>

                  {error && <div className="error-message">{error}</div>}

                  {prediction && (
                    <div
                      className="prediction-result"
                      style={{ '--segment-color': prediction.color }}
                    >
                      <div className="result-top">
                        <span className="result-check">✓</span>
                        <span>PREDICTION COMPLETE</span>
                      </div>
                      <div className="result-cluster">
                        Cluster {prediction.predicted_cluster}
                      </div>
                      <h3>{prediction.name}</h3>
                      <p>{prediction.type}</p>

                      <div className="result-metrics">
                        <div>
                          <span>Annual income</span>
                          <strong>
                            ${Number(prediction.annual_income).toFixed(1)}k
                          </strong>
                        </div>
                        <div>
                          <span>Spending score</span>
                          <strong>{prediction.spending_score}/100</strong>
                        </div>
                      </div>

                      <div className="result-note">
                        Segment names are descriptive labels; the model
                        predicts a cluster number.
                      </div>
                    </div>
                  )}
                </div>

                <div className="panel segment-guide">
                  <span className="section-kicker">SEGMENT DIRECTORY</span>
                  <h2>Know the {profiles.length} clusters</h2>
                  <p className="panel-description">
                    Click a cluster to explore its customers.
                  </p>

                  <div className="segment-list">
                    {profiles.map((profile) => (
                      <button
                        className="segment-row"
                        key={profile.id}
                        onClick={() => openCluster(profile.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          cursor: 'pointer',
                          background: 'transparent',
                          border: 0,
                          color: 'inherit',
                        }}
                      >
                        <div
                          className="segment-color"
                          style={{ background: profile.color }}
                        />
                        <div className="segment-info">
                          <strong>{profile.name}</strong>
                          <span>{profile.type}</span>
                        </div>
                        <span className="segment-id">C{profile.id}</span>
                      </button>
                    ))}
                  </div>

                  <div className="tip-box">
                    <Zap size={17} />
                    <p>
                      <strong>How it works</strong>
                      <br />
                      The API scales the input features and uses K-Means to
                      assign the closest learned cluster.
                    </p>
                  </div>
                </div>
              </section>
            )}

          <footer className="footer">
            <span>
              ClusterIQ <span className="footer-separator">·</span> Customer
              segmentation studio
            </span>
            <span>
              <i className="status-dot" /> Powered by K-Means ML
            </span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App